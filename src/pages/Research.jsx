import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { historyApi, searchApi } from "@/api";

const DEFAULT_TAGS = [
  "All",
  "AI",
  "Machine Learning",
  "NLP",
  "Computer Vision",
];
const STORAGE_KEY = "clip_recent_searches";

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveRecent(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function normalizeRecentItems(data) {
  const list = data?.data ?? data?.content ?? data?.recentSearches ?? data;
  if (!Array.isArray(list)) return [];
  return list
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `${item}-${index}`,
          query: item,
          searchedAt: new Date().toISOString(),
        };
      }
      return {
        id: item.id ?? item.historyId ?? `${item.query ?? item.keyword}-${index}`,
        query: item.query ?? item.keyword ?? item.searchWord ?? "",
        searchedAt: item.searchedAt ?? item.createdAt ?? item.updatedAt,
      };
    })
    .filter((item) => item.query);
}

function normalizeTrendTags(data) {
  const list = data?.data ?? data?.content ?? data?.keywords ?? data;
  if (!Array.isArray(list)) return [];
  return list
    .map((item) =>
      typeof item === "string"
        ? item
        : item.keyword ?? item.label ?? item.word ?? item.name,
    )
    .filter(Boolean);
}

function Research() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState(DEFAULT_TAGS);
  const [focused, setFocused] = useState(false);
  const [recents, setRecents] = useState(loadRecent);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadServerSearchData() {
      const [recentResult, trendResult] = await Promise.allSettled([
        searchApi.getRecentSearchWords(),
        searchApi.getTrendKeywords(),
      ]);

      if (ignore) return;

      if (recentResult.status === "fulfilled") {
        const serverRecents = normalizeRecentItems(recentResult.value);
        if (serverRecents.length > 0) {
          setRecents(serverRecents);
          saveRecent(serverRecents);
        }
      }

      if (trendResult.status === "fulfilled") {
        const trendTags = normalizeTrendTags(trendResult.value);
        if (trendTags.length > 0) setTags(["All", ...trendTags.slice(0, 8)]);
      }
    }

    loadServerSearchData();
    return () => {
      ignore = true;
    };
  }, []);

  const removeTag = (tag) => {
    if (tag === "All") return;
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const addRecent = (q) => {
    const item = {
      id: Date.now().toString(),
      query: q,
      searchedAt: new Date().toISOString(),
    };
    // 동일한 query가 있으면 제거 후 맨 앞에 추가, 최대 20개 보관
    const next = [item, ...recents.filter((r) => r.query !== q)].slice(0, 20);
    setRecents(next);
    saveRecent(next);
  };

  const removeRecent = (id) => {
    const next = recents.filter((r) => r.id !== id);
    setRecents(next);
    saveRecent(next);
  };

  const selectRecent = (item) => {
    setQuery(item.query);
    setFocused(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const q = query.trim();
    addRecent(q);
    setFocused(false);
    setSearchError("");
    setIsSearching(true);

    try {
      const searchResult = await searchApi.searchPapers({ keyword: q });
      historyApi.saveHistory({ keyword: q }).catch(() => {});
      navigate("/roadmap", { state: { query: q, searchResult } });
    } catch (error) {
      setSearchError(
        error?.response?.data?.message ??
          error?.response?.data?.error ??
          "검색 중 문제가 발생했습니다.",
      );
    } finally {
      setIsSearching(false);
    }
  };

  const showDropdown = focused && recents.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-8">
      <h1 className="text-3xl font-bold text-[#1E293B] mb-8 tracking-tight">
        키워드 논문 저자 등으로 검색해보세요
      </h1>

      <div className="w-full max-w-170 flex flex-col items-center gap-4">
        <div className="relative w-full">
          <form onSubmit={handleSubmit}>
            <div
              onClick={() => inputRef.current?.focus()}
              className={`flex items-center gap-3 w-full bg-white px-5 py-3.5 cursor-text transition-all
                          border border-[#E2E8F0] shadow-sm
                          ${
                            showDropdown
                              ? "rounded-t-2xl rounded-b-none border-b-transparent shadow-md"
                              : "rounded-full focus-within:border-[#1D4ED8] focus-within:shadow-md"
                          }`}
            >
              <svg
                className="w-5 h-5 text-[#94A3B8] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                placeholder="검색어를 입력하세요..."
                className="flex-1 bg-transparent text-[#1E293B] text-base placeholder-[#CBD5E1] outline-none"
              />
              {isSearching && (
                <span className="text-xs font-medium text-[#64748B]">
                  검색 중...
                </span>
              )}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* 최근 검색 드롭다운 (최대 5개) */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 bg-white border border-[#E2E8F0] border-t-0
                         rounded-b-2xl shadow-md overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-5 pt-3 pb-1">
                <span className="text-xs font-medium text-[#94A3B8]">최근 검색</span>
                <button
                  onClick={() => { saveRecent([]); setRecents([]); }}
                  className="text-xs text-[#94A3B8] hover:text-[#475569] transition-colors"
                >
                  전체 삭제
                </button>
              </div>
              <ul className="py-1">
                {recents.slice(0, 5).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#F8FAFC] cursor-pointer group"
                    onMouseDown={(e) => { e.preventDefault(); selectRecent(item); }}
                  >
                    <svg className="w-4 h-4 text-[#CBD5E1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1 text-sm text-[#334155]">{item.query}</span>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); removeRecent(item.id); }}
                      className="opacity-0 group-hover:opacity-100 text-[#CBD5E1] hover:text-[#94A3B8] transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {searchError && (
          <p className="text-sm text-red-500" role="alert">
            {searchError}
          </p>
        )}

        {/* 필터 태그 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border transition-colors
                  ${tag === "All"
                    ? "bg-[#EFF3FF] border-[#C7D7FE] text-[#3B5BDB] font-medium"
                    : "bg-white border-[#E2E8F0] text-[#475569]"
                  }`}
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-current opacity-50 hover:opacity-100 transition-opacity leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Research;

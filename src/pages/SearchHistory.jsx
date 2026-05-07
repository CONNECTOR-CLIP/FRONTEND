import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { historyApi } from "@/api";

const STORAGE_KEY = "clip_recent_searches";

const MOCK_HISTORY = import.meta.env.DEV
  ? [
      {
        id: "mock-1",
        query: "Transformer Attention Mechanism",
        searchedAt: "2026-04-22T10:30:00.000Z",
      },
      {
        id: "mock-2",
        query: "Reinforcement Learning Policy Gradient",
        searchedAt: "2026-04-20T14:20:00.000Z",
      },
      {
        id: "mock-3",
        query: "Large Language Models Survey",
        searchedAt: "2026-04-18T09:15:00.000Z",
      },
      {
        id: "mock-4",
        query: "Diffusion Models Image Generation",
        searchedAt: "2026-04-16T16:45:00.000Z",
      },
      {
        id: "mock-5",
        query: "BERT Natural Language Processing",
        searchedAt: "2026-04-14T11:00:00.000Z",
      },
    ]
  : [];

function loadRecent() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored === null) return MOCK_HISTORY;
    return stored;
  } catch {
    return MOCK_HISTORY;
  }
}

function saveRecent(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function normalizeHistory(data) {
  const list = data?.data ?? data?.content ?? data?.histories ?? data;
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

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function SearchHistory() {
  const navigate = useNavigate();
  const [recents, setRecents] = useState(loadRecent);
  const [filterQuery, setFilterQuery] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadHistory() {
      try {
        const data = await historyApi.getHistory();
        const serverHistory = normalizeHistory(data);
        if (!ignore && serverHistory.length > 0) {
          setRecents(serverHistory);
          saveRecent(serverHistory);
          setLoadError("");
        }
      } catch {
        if (!ignore) {
          setLoadError("검색 기록 API 연결에 실패하여 로컬 기록을 표시합니다.");
        }
      }
    }

    loadHistory();
    return () => {
      ignore = true;
    };
  }, []);

  const trimmed = filterQuery.trim();
  const searchDisabled = !trimmed || recents.length === 0;

  const filtered = recents.filter(
    (r) => !trimmed || r.query.toLowerCase().includes(trimmed.toLowerCase())
  );

  const removeRecent = (id) => {
    const next = recents.filter((r) => r.id !== id);
    setRecents(next);
    saveRecent(next);
  };

  const clearAll = () => {
    setRecents([]);
    saveRecent([]);
    setFilterQuery("");
  };

  const goToRoadmap = (item) => {
    navigate("/roadmap", { state: { query: item.query } });
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-8 py-10 flex flex-col gap-8">

      {/* 헤더 */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#173355]">검색 기록</h1>
          <p className="mt-2 text-base text-[#466084]">
            과거 검색으로 생성된 로드맵을 다시 열어볼 수 있습니다.
          </p>
        </div>
        {recents.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-[#94A3B8] hover:text-[#EF4444] transition-colors pb-1"
          >
            전체 삭제
          </button>
        )}
      </div>

      {/* 검색창 */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex gap-3 max-w-2xl"
      >
        <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl border border-[#E2E8F0] px-5 py-3.5 focus-within:border-[#1D4ED8] focus-within:shadow-md transition-all shadow-sm">
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
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="기록 내 검색..."
            className="flex-1 bg-transparent text-base text-[#1E293B] placeholder-[#CBD5E1] outline-none"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery("")}
              className="text-[#CBD5E1] hover:text-[#94A3B8] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={searchDisabled}
          className={`px-6 py-3.5 rounded-2xl text-sm font-semibold transition-colors
            ${searchDisabled
              ? "bg-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed"
              : "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]"
            }`}
        >
          검색
        </button>
      </form>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {loadError}
        </div>
      )}

      {/* 결과 영역 */}
      {recents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <svg className="w-12 h-12 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base text-[#94A3B8]">검색 기록이 없습니다.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
          <ul>
            {recents.map((item) => {
              const visible =
                !trimmed ||
                item.query.toLowerCase().includes(trimmed.toLowerCase());
              return (
                <li
                  key={item.id}
                  style={{
                    maxHeight: visible ? "80px" : "0px",
                    opacity: visible ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.2s ease, opacity 0.15s ease",
                    borderBottom: visible ? "1px solid #F1F5F9" : "none",
                  }}
                >
                  <div
                    onClick={() => goToRoadmap(item)}
                    className="flex items-center gap-4 px-6 py-5 hover:bg-[#F8FAFC] cursor-pointer group transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1E293B] truncate">
                        {item.query}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        {formatDate(item.searchedAt)}
                      </p>
                    </div>

                    <svg
                      className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1D4ED8] transition-colors shrink-0"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 5l7 7-7 7" />
                    </svg>

                    <button
                      onClick={(e) => { e.stopPropagation(); removeRecent(item.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#CBD5E1] hover:text-[#EF4444] transition-all ml-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {trimmed && filtered.length === 0 && (
            <p className="text-sm text-[#CBD5E1] text-center py-8">
              검색 기록이 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchHistory;

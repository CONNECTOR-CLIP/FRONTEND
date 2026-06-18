import { useRef, useLayoutEffect, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";
import { RoadmapPreview } from "@/pages/Roadmap";
import { searchApi, bookmarksApi, paperApi, historyApi } from "@/api";

/* ─── Tag Colors ─── */
const tagColor = (tag) => {
  const map = {
    AI: "bg-blue-100 text-blue-700",
    ML: "bg-purple-100 text-purple-700",
    "DEEP LEARNING": "bg-indigo-100 text-indigo-700",
    NLP: "bg-green-100 text-green-700",
    LLM: "bg-orange-100 text-orange-700",
  };
  return map[tag?.toUpperCase()] ?? "bg-gray-100 text-gray-600";
};

/* ─── 활동 아이콘 ─── */
function ActivityIcon({ type }) {
  const base = "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0";
  if (type === "search")
    return (
      <div className={`${base} bg-[#0060AD]`}>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>
    );
  return (
    <div className={`${base} bg-[#7C3AED]`}>
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </div>
  );
}

/* ─── 날짜 포맷 ─── */
function timeAgo(isoStr) {
  if (!isoStr) return "";
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

/* ─── Paper Card ─── */
function PaperCard({ paper }) {
  const titleRef = useRef(null);
  const [descMaxWidth, setDescMaxWidth] = useState(null);
  const title = paper.title ?? paper.paperId ?? "";
  const desc = paper.abstracts ?? paper.abstract ?? "";
  const author = paper.author ?? paper.submitter ?? "—";
  const date = paper.createdDate ?? paper.published ?? "";
  const category = paper.privaryCategory ?? paper.categories?.split(",")?.[0] ?? "";

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el || !title) return;
    const style = window.getComputedStyle(el);
    const font = style.font;
    const lineHeight = parseFloat(style.lineHeight) || 20;
    const prepared = prepareWithSegments(title, font);
    const { lines } = layoutWithLines(prepared, 9999, lineHeight);
    const naturalWidth = lines[0]?.width ?? null;
    if (naturalWidth != null) setDescMaxWidth(naturalWidth);
  }, [title]);

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-5 flex flex-col gap-[16px] hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex flex-wrap gap-1.5 mt-[8px]">
        {category && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColor(category)}`}>
            {category}
          </span>
        )}
      </div>
      <div style={descMaxWidth != null ? { maxWidth: descMaxWidth } : undefined}>
        <h3 ref={titleRef} className="text-sm font-bold text-[#1E293B] leading-snug mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
          {desc}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-xs text-[#94A3B8]">
        <div className="flex items-center gap-1.5 min-w-0">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <span className="truncate">{author}</span>
        </div>
        <span>{date ? new Date(date).toLocaleDateString("ko-KR") : ""}</span>
      </div>
    </div>
  );
}

/* ─── Home Page ─── */
function Home() {
  const navigate = useNavigate();
  const [flowInstance, setFlowInstance] = useState(null);
  const [lastKeyword, setLastKeyword] = useState(null);

  const [trendKeywords, setTrendKeywords] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [recentPapers, setRecentPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const normalize = (data, keys) => {
      if (Array.isArray(data)) return data;
      for (const k of keys) if (Array.isArray(data?.[k])) return data[k];
      return [];
    };

    Promise.allSettled([
      searchApi.getTrendKeywords(),
      bookmarksApi.getBookmarks(),
      historyApi.getHistory(),
      paperApi.getPaperList({ page: 0, size: 3 }),
    ]).then(([trend, bm, hist, papers]) => {
      if (trend.status === "fulfilled") {
        const list = normalize(trend.value, ["data", "keywords", "trends"]);
        setTrendKeywords(list.slice(0, 3).map((kw, i) => ({ rank: i + 1, label: typeof kw === "string" ? kw : kw.keyword ?? kw.label ?? "" })));
      }
      if (bm.status === "fulfilled") {
        setBookmarks(normalize(bm.value, ["data", "bookmarks", "content"]));
      }
      if (hist.status === "fulfilled") {
        const list = normalize(hist.value, ["data", "content", "histories"]);
        setHistory(list.map(h => ({
          keyword: h.keyword ?? h.query ?? h.searchWord ?? "",
          createdAt: h.createdAt ?? h.searchedAt ?? null,
        })));
      }
      if (papers.status === "fulfilled") {
        setRecentPapers(normalize(papers.value, ["data", "content", "papers"]).slice(0, 3));
      }
      setLoading(false);
    });
  }, []);

  /* ── 내 현황 계산 ── */
  const bookmarkCount = bookmarks.length;
  const historyCount = history.length;

  const topCategory = useMemo(() => {
    if (!bookmarks.length) return "-";
    const freq = {};
    bookmarks.forEach(b => {
      const cat = b.category || b.privaryCategory || b.primaryCategory;
      if (cat) freq[cat] = (freq[cat] || 0) + 1;
    });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? "-";
  }, [bookmarks]);

  const myStatus = [
    { label: "편을 저장했어요", value: bookmarkCount },
    { label: "개의 키워드를 검색했어요", value: historyCount },
    { label: "최근에 많이 스크랩한 키워드", value: topCategory },
  ];

  /* ── 최근 활동 조합 ── */
  const recentActivities = useMemo(() => {
    const histItems = history.slice(0, 3).map(h => ({
      icon: "search",
      text: `'${h.keyword}' 키워드 검색`,
      time: timeAgo(h.createdAt),
    }));
    const bmItems = bookmarks.slice(0, 3).map(b => ({
      icon: "save",
      text: `'${b.title ?? b.paperId}' 북마크 저장`,
      time: "",
    }));
    const merged = [...histItems];
    for (const bm of bmItems) {
      if (merged.length >= 3) break;
      merged.push(bm);
    }
    return merged.slice(0, 3);
  }, [history, bookmarks]);

  return (
    <div className="mx-auto max-w-screen-3xl px-8 py-8 flex flex-col gap-6">
      {/* ── 상단: 로드맵(좌) / 사이드바(우) ── */}
      <div className="flex gap-6">
        {/* Left: 타이틀 + 로드맵 */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div>
            <h1 className="text-lg font-bold text-[#173355]">CLIP Dashboard</h1>
            <p className="mt-1 text-regular text-[#466084]">
              돌아오셔서 기뻐요. 여기 마지막으로 탐색하신 로드맵이에요.
            </p>
          </div>

          <div className="h-[779px] rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 pt-5 pb-2">
              <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-semibold text-[#1E293B]">최근 로드맵</span>
              <span className="text-sm text-[#94A3B8] ml-1">Recent Roadmap</span>
            </div>
            <div className="h-160 bg-white mx-4 rounded-xl overflow-hidden">
              <RoadmapPreview onInit={setFlowInstance} onKeywordLoad={setLastKeyword} />
            </div>
            <div className="flex justify-end items-center gap-2 px-6 py-4">
              <div className="flex gap-1.5 ml-1">
                <button onClick={() => flowInstance?.zoomIn({ duration: 200 })}
                  className="rounded-full w-15 h-15 bg-[#000000]/15 text-white flex items-center justify-center hover:bg-[#00509e] transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                    <line x1="8" y1="11" x2="14" y2="11" strokeWidth="2" strokeLinecap="round" />
                    <line x1="11" y1="8" x2="11" y2="14" strokeWidth="2" strokeLinecap="round" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <button onClick={() => flowInstance?.zoomOut({ duration: 200 })}
                  className="rounded-full w-15 h-15 bg-[#000000]/15 text-white flex items-center justify-center hover:bg-[#00509e] transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                    <line x1="8" y1="11" x2="14" y2="11" strokeWidth="2" strokeLinecap="round" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <button onClick={() => navigate("/roadmap", lastKeyword ? { state: { query: lastKeyword } } : undefined)}
                  className="rounded-full w-15 h-15 bg-[#000000]/15 text-white flex items-center justify-center hover:bg-[#00509e] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 11 11" fill="none">
                    <path d="M0 10.5V7.58333H1.16667V9.33333H2.91667V10.5H0ZM7.58333 10.5V9.33333H9.33333V7.58333H10.5V10.5H7.58333ZM0 2.91667V0H2.91667V1.16667H1.16667V2.91667H0ZM9.33333 2.91667V1.16667H7.58333V0H10.5V2.91667H9.33333Z" fill="white" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="w-[400px] shrink-0 flex flex-col gap-[32px]">
          {/* 트렌딩 키워드 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#EFF3FF] shadow-sm p-[32px]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-[#1E293B] text-sm">트렌딩 중인 키워드</span>
              <svg className="w-4 h-4 text-[#1e6ad4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 rounded-xl bg-white/60 animate-pulse" />
                ))}
              </div>
            ) : trendKeywords.length > 0 ? (
              <div className="flex flex-col gap-3">
                {trendKeywords.map((kw) => (
                  <div key={kw.rank}
                    onClick={() => navigate("/Research", { state: { autoSearch: kw.label } })}
                    className="flex items-center bg-white gap-3 rounded-xl border border-[#F1F5F9] px-3 py-2.5 hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                    <span className="w-5 h-5 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[11px] font-bold text-[#64748B]">
                      {kw.rank}
                    </span>
                    <span className="text-xs text-[#334155] font-medium">{kw.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] text-center py-4">트렌드 키워드 정보가 없습니다.</p>
            )}
          </div>

          {/* 내 현황 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#EFF3FF] shadow-sm p-5">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="font-semibold text-[#1E293B] text-sm">내 현황</span>
              <span className="text-xs text-[#94A3B8]">My Status</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {myStatus.map((s, i) => (
                <div key={i} className="rounded-xl bg-[#F8FAFC] p-3 flex flex-col gap-1 h-[100px]">
                  <p className="text-[12px] text-[#94A3B8] leading-tight">{s.label}</p>
                  {loading ? (
                    <div className="h-8 w-12 rounded bg-gray-200 animate-pulse mt-1" />
                  ) : (
                    <p className={`font-bold ${typeof s.value === "number" ? "text-[30px] text-[#0060AD]" : "text-[22px] text-[#173355]"}`}>
                      {s.value ?? 0}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#EFF3FF] shadow-sm p-8">
            <h3 className="font-semibold text-[#1E293B] text-sm mb-4">최근 활동</h3>
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mb-1" />
                      <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="flex flex-col gap-[24px]">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <ActivityIcon type={act.icon} />
                    <div>
                      <p className="text-xs text-[#334155] font-medium leading-snug">{act.text}</p>
                      {act.time && <p className="text-[11px] text-[#94A3B8] mt-0.5">{act.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] text-center py-4">최근 활동이 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── 하단: 최근 본 논문 ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#1E293B]">최근 본 논문</h2>
          <button onClick={() => navigate("/Research")}
            className="text-sm text-[#6366F1] hover:underline">
            검색하러 가기 →
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-white h-48 animate-pulse" />
            ))}
          </div>
        ) : recentPapers.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {recentPapers.map((paper, idx) => (
              <PaperCard key={idx} paper={paper} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white py-16 flex flex-col items-center gap-3">
            <svg className="w-10 h-10 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-[#94A3B8]">아직 검색된 논문이 없습니다.</p>
            <button onClick={() => navigate("/Research")}
              className="text-sm text-[#1D4ED8] hover:underline">검색하러 가기</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

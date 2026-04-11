import { useRef, useLayoutEffect, useState } from "react";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

/* ─── 목데이터 ─── */
const trendingKeywords = [
  { rank: 1, label: "Transformer Architecture" },
  { rank: 2, label: "GANs in Computer Vision" },
  { rank: 3, label: "Reinforcement Learning" },
];

const myStatus = [
  { label: "편을 읽으셨어요", firstvalue: 127 },
  { label: "편을 저장했어요", value: 43 },
  { label: "개의 키워드를 검색했어요", value: 89 },
  { label: "개의 키워드를 확인했어요", value: 12 },
];

const recentActivities = [
  {
    icon: "analyze",
    text: "Analyzed 'Attention Is All You Need'",
    time: "2 hours ago",
  },
  {
    icon: "save",
    text: "Saved 'BERT Explained' to Roadmap",
    time: "5 hours ago",
  },
  { icon: "save", text: "Shared 'ML Basics' with Network", time: "Yesterday" },
];

const recentPapers = [
  {
    tags: ["AI", "ML"],
    title: "Attention Mechanisms in Transformers",
    desc: "Exploring the evolutionary shift from RNNs to self-attention based architectures in modern NLP...",
    author: "저자",
    date: "Oct 12, 2023",
  },
  {
    tags: ["DEEP LEARNING"],
    title: "Deep Reinforcement Learning in Robotics",
    desc: "An in-depth analysis of policy gradient methods applied to real-world robotic manipulator control...",
    author: "저자",
    date: "Oct 10, 2023",
  },
  {
    tags: ["NLP", "LLM"],
    title: "Large Language Models: A Comprehensive Survey",
    desc: "Tracing the development of generative pre-trained models from GPT-1 to the current state-o...",
    author: "저자",
    date: "Sep 28, 2023",
  },
];

/* ─── 마인드맵 목데이터 ─── */
function RoadmapGraph() {
  const cx = 440,
    cy = 240;
  const nodes = [
    {
      id: "center",
      x: cx,
      y: cy,
      label: "Deep\nLearning",
      sub: "CORE ENTITY",
      r: 52,
      main: true,
    },
    { id: "nn", x: cx - 200, y: cy - 140, label: "Neural Networks", r: 38 },
    { id: "tr", x: cx - 240, y: cy + 20, label: "Transformer", r: 38 },
    { id: "bt", x: cx + 160, y: cy - 110, label: "BerTopic", r: 34 },
    { id: "am", x: cx + 140, y: cy + 80, label: "AI Models", r: 36 },
    { id: "am2", x: cx - 40, y: cy + 160, label: "AI Models", r: 36 },
  ];
  const edges = [
    ["center", "nn"],
    ["center", "tr"],
    ["center", "bt"],
    ["center", "am"],
    ["center", "am2"],
  ];

  return (
    <svg
      viewBox="0 0 880 480"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* edges */}
      {edges.map(([a, b], i) => {
        const na = nodes.find((n) => n.id === a);
        const nb = nodes.find((n) => n.id === b);
        return (
          <line
            key={i}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        );
      })}
      {/* nodes */}
      {nodes.map((node) => (
        <g key={node.id}>
          {node.main ? (
            <>
              <circle cx={node.x} cy={node.y} r={node.r} fill="#3B5BDB" />
              <text
                x={node.x}
                y={node.y - 8}
                textAnchor="middle"
                fill="white"
                fontSize="13"
                fontWeight="600"
              >
                {node.label.split("\n")[0]}
              </text>
              <text
                x={node.x}
                y={node.y + 8}
                textAnchor="middle"
                fill="white"
                fontSize="13"
                fontWeight="600"
              >
                {node.label.split("\n")[1]}
              </text>
              <text
                x={node.x}
                y={node.y + 24}
                textAnchor="middle"
                fill="#BFD0FF"
                fontSize="9"
                letterSpacing="1"
              >
                {node.sub}
              </text>
            </>
          ) : (
            <>
              <rect
                x={node.x - node.r}
                y={node.y - 16}
                width={node.r * 2}
                height={32}
                rx={16}
                fill="#1E293B"
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="11.5"
                fontWeight="500"
              >
                {node.label}
              </text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ─── 활동 ─── */
function ActivityIcon({ type }) {
  const base =
    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0";
  if (type === "analyze")
    return (
      <div className={`${base} bg-[#0060AD]`}>
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
    );
  if (type === "save")
    return (
      <div className={`${base} bg-[#7C3AED]`}>
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </div>
    );
}

/* ─── Tag Colors ─── */
const tagColor = (tag) => {
  const map = {
    AI: "bg-blue-100 text-blue-700",
    ML: "bg-purple-100 text-purple-700",
    "DEEP LEARNING": "bg-indigo-100 text-indigo-700",
    NLP: "bg-green-100 text-green-700",
    LLM: "bg-orange-100 text-orange-700",
  };
  return map[tag] ?? "bg-gray-100 text-gray-600";
};

/* ─── Paper Card ─── */
function PaperCard({ paper }) {
  const titleRef = useRef(null);
  const [descMaxWidth, setDescMaxWidth] = useState(null);

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const style = window.getComputedStyle(el);
    const font = style.font;
    const lineHeight = parseFloat(style.lineHeight) || 20;
    const prepared = prepareWithSegments(paper.title, font);
    // 9999px: 줄바꿈 없이 한 줄로 펼쳤을 때의 자연 너비 측정
    const { lines } = layoutWithLines(prepared, 9999, lineHeight);
    const naturalWidth = lines[0]?.width ?? null;
    if (naturalWidth != null) setDescMaxWidth(naturalWidth);
  }, [paper.title]);

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-5 flex flex-col gap-[16px] hover:shadow-md transition-shadow cursor-pointer">
      {/* tags */}
      <div className="flex flex-wrap gap-1.5 mt-[32px]">
        {paper.tags.map((tag) => (
          <span
            key={tag}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColor(tag)}`}
          >
            {tag}
          </span>
        ))}
      </div>
      {/* title + desc — desc는 제목의 자연 너비에 맞춰 줄바꿈 */}
      <div
        style={descMaxWidth != null ? { maxWidth: descMaxWidth } : undefined}
      >
        <h3
          ref={titleRef}
          className="text-sm font-bold text-[#1E293B] leading-snug mb-1"
        >
          {paper.title}
        </h3>
        <p className="text-xs text-[#94A3B8] leading-relaxed break-words">
          {paper.desc}
        </p>
      </div>
      {/* footer */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-xs text-[#94A3B8]">
        <div className="flex items-center gap-1.5 min-w-0">
          <svg
            className="w-4 h-4 shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <span className="truncate">{paper.author ?? "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{paper.date}</span>
          <button className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#6366F1] hover:bg-[#E0E7FF] transition-colors shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Home Page ─── */
function Home() {
  return (
    <div className="mx-auto max-w-screen-3xl px-8 py-8 flex flex-col gap-6">
      {/* ── 상단: 타이틀 + 로드맵(좌) / 사이드바(우) ── */}
      <div className="flex gap-6">
        {/* Left: 타이틀 + 로드맵 */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Title */}
          <div>
            <h1 className="text-lg font-bold text-[#173355]">CLIP Dashboard</h1>
            <p className="mt-1 text-regular text-[#466084]">
              돌아오셔서 기뻐요. 여기 마지막으로 탐색하신 로드맵이에요.
            </p>
          </div>

          {/* 최근로드맵 */}
          <div className="h-[779px] rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
            {/* card header */}
            <div className="flex items-center gap-2 px-6 pt-5 pb-2">
              <svg
                className="w-5 h-5 text-[#6366F1]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="font-semibold text-[#1E293B]">최근 로드맵</span>
              <span className="text-sm text-[#94A3B8] ml-1">
                Recent Roadmap
              </span>
            </div>

            {/* graph area */}
            <div className="h-160 bg-white mx-4 rounded-xl overflow-hidden">
              <RoadmapGraph />
            </div>

            {/* expand button */}
            <div className="flex justify-end items-center gap-2 px-6 py-4">
              <div className="flex gap-1.5 ml-1">
                <button
                  id="zoom-in"
                  className="rounded-full w-6 h-6 bg-[#000000]/15 text-white flex items-center justify-center hover:bg-[#00509e] transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                    <line
                      x1="8"
                      y1="11"
                      x2="14"
                      y2="11"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="11"
                      y1="8"
                      x2="11"
                      y2="14"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="16.5"
                      y1="16.5"
                      x2="21"
                      y2="21"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <button
                  id="zoom-out"
                  className="rounded-full w-6 h-6 bg-[#000000]/15 text-white flex items-center justify-center hover:bg-[#00509e] transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                    <line
                      x1="8"
                      y1="11"
                      x2="14"
                      y2="11"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="16.5"
                      y1="16.5"
                      x2="21"
                      y2="21"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <button
                  id="expand"
                  className="rounded-full w-6 h-6 bg-[#000000]/15 text-white flex items-center justify-center hover:bg-[#00509e] transition-colors"
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 10.5V7.58333H1.16667V9.33333H2.91667V10.5H0ZM7.58333 10.5V9.33333H9.33333V7.58333H10.5V10.5H7.58333ZM0 2.91667V0H2.91667V1.16667H1.16667V2.91667H0ZM9.33333 2.91667V1.16667H7.58333V0H10.5V2.91667H9.33333Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="w-[400px] shrink-0 flex flex-col gap-[32px]">
          {/* Trending Keywords */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#EFF3FF] shadow-sm p-[32px]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-[#1E293B] text-sm">
                트렌딩 중인 키워드
              </span>
              <svg
                className="w-4 h-4 text-[#1e6ad4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-3">
              {trendingKeywords.map((kw) => (
                <div
                  id="rank-button"
                  key={kw.rank}
                  className="flex items-center bg-white gap-3 rounded-xl border border-[#F1F5F9] px-3 py-2.5 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[11px] font-bold text-[#64748B]">
                    {kw.rank}
                  </span>
                  <span className="text-xs text-[#334155] font-medium">
                    {kw.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* My Status */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#EFF3FF] shadow-sm p-5">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="font-semibold text-[#1E293B] text-sm">
                내 현황
              </span>
              <span className="text-xs text-[#94A3B8]">My Status</span>
            </div>
            <div className="relative grid grid-cols-2 gap-2">
              {myStatus.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#F8FAFC] p-3 flex flex-col gap-1 h-[100px]"
                >
                  <p className="text-[12px] text-[#94A3B8] leading-tight">
                    {s.label}
                  </p>
                  {s.firstvalue != null && (
                    <p className="text-[30px] font-bold text-[#0060AD]">
                      {s.firstvalue}
                    </p>
                  )}
                  {s.value != null && (
                    <p className="text-[30px] font-bold text-[#173355]">
                      {s.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#EFF3FF] shadow-sm p-8">
            <h3 className="font-semibold text-[#1E293B] text-sm mb-4">
              최근 활동
            </h3>
            <div className="flex flex-col gap-[24px]">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <ActivityIcon type={act.icon} />
                  <div>
                    <p className="text-xs text-[#334155] font-medium leading-snug">
                      {act.text}
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ── 하단: 최근 본 논문 (전체 너비) ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#1E293B]">최근 본 논문</h2>
          <button className="text-sm text-[#6366F1] hover:underline">
            View all archive →
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {recentPapers.map((paper, idx) => (
            <PaperCard key={idx} paper={paper} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

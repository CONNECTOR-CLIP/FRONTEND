import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { roadmapApi, gapApi, paperApi, bookmarksApi, historyApi } from "@/api";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// API 연동 전 UI 확인용 샘플 데이터 — 실제 서비스에서는 API 응답으로 대체됨
const SAMPLE_DATA = {
  version: "1.0",
  generated_at: "2026-04-15T18:18:22.057044+00:00",
  roots: [
    {
      arxiv_primary_category: "cs.AI",
      intermediate_nodes: [
        {
          node_id: "cs.AI::large language models::language model",
          label: "Language Model",
          cfo: {
            label_id: "language model",
            initial_keywords: [
              "language model@en .",
              "language modeling@en .",
              "language models@en .",
              "n-gram language models@en .",
              "statistical language models@en .",
            ],
          },
          children: [
            {
              paper_id: "2412.03884",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2503.18018",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2505.02781",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2505.07315",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2505.13126",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2508.15358",
              assignment: { score: 0.1, was_reexpressed: false },
            },
            {
              paper_id: "2512.08296",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2602.03249",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2604.02022",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2604.05297",
              assignment: { score: 1.0, was_reexpressed: false },
            },
          ],
        },
        {
          node_id: "cs.AI::large language models::transformer",
          label: "Transformer",
          cfo: {
            label_id: "transformer",
            initial_keywords: [
              "transformer@en .",
              "attention mechanism@en .",
              "self-attention@en .",
              "multi-head attention@en .",
            ],
          },
          children: [
            {
              paper_id: "2301.00234",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2302.05442",
              assignment: { score: 0.9, was_reexpressed: false },
            },
            {
              paper_id: "2303.12980",
              assignment: { score: 0.8, was_reexpressed: false },
            },
            {
              paper_id: "2304.01373",
              assignment: { score: 1.0, was_reexpressed: false },
            },
          ],
        },
        {
          node_id: "cs.AI::neural networks::deep learning",
          label: "Deep Learning",
          cfo: {
            label_id: "deep learning",
            initial_keywords: [
              "deep learning@en .",
              "deep neural network@en .",
              "convolutional neural network@en .",
            ],
          },
          children: [
            {
              paper_id: "2401.10011",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2402.10022",
              assignment: { score: 0.9, was_reexpressed: false },
            },
            {
              paper_id: "2403.10033",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2404.10044",
              assignment: { score: 0.7, was_reexpressed: true },
            },
          ],
        },
        {
          node_id: "cs.AI::reinforcement learning::policy gradient",
          label: "Policy Gradient",
          cfo: {
            label_id: "policy gradient",
            initial_keywords: [
              "policy gradient@en .",
              "reinforcement learning@en .",
              "reward function@en .",
            ],
          },
          children: [
            {
              paper_id: "2401.20011",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2402.20022",
              assignment: { score: 0.8, was_reexpressed: false },
            },
            {
              paper_id: "2405.20033",
              assignment: { score: 0.6, was_reexpressed: true },
            },
          ],
        },
        {
          node_id: "cs.AI::computer vision::object detection",
          label: "Object Detection",
          cfo: {
            label_id: "object detection",
            initial_keywords: [
              "object detection@en .",
              "YOLO@en .",
              "bounding box@en .",
              "anchor-based detection@en .",
            ],
          },
          children: [
            {
              paper_id: "2401.30011",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2402.30022",
              assignment: { score: 0.9, was_reexpressed: false },
            },
            {
              paper_id: "2403.30033",
              assignment: { score: 0.7, was_reexpressed: false },
            },
            {
              paper_id: "2404.30044",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2501.30055",
              assignment: { score: 0.8, was_reexpressed: false },
            },
          ],
        },
        {
          node_id: "cs.AI::computer vision::image generation",
          label: "Image Generation",
          cfo: {
            label_id: "image generation",
            initial_keywords: [
              "image generation@en .",
              "diffusion model@en .",
              "generative adversarial network@en .",
            ],
          },
          children: [
            {
              paper_id: "2401.40011",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2402.40022",
              assignment: { score: 0.8, was_reexpressed: false },
            },
            {
              paper_id: "2503.40033",
              assignment: { score: 1.0, was_reexpressed: false },
            },
          ],
        },
        {
          node_id: "cs.AI::natural language processing::text classification",
          label: "Text Classification",
          cfo: {
            label_id: "text classification",
            initial_keywords: [
              "text classification@en .",
              "sentiment analysis@en .",
              "document classification@en .",
            ],
          },
          children: [
            {
              paper_id: "2401.50011",
              assignment: { score: 0.9, was_reexpressed: false },
            },
            {
              paper_id: "2402.50022",
              assignment: { score: 0.7, was_reexpressed: false },
            },
            {
              paper_id: "2403.50033",
              assignment: { score: 1.0, was_reexpressed: false },
            },
          ],
        },
        {
          node_id: "cs.AI::natural language processing::machine translation",
          label: "Machine Translation",
          cfo: {
            label_id: "machine translation",
            initial_keywords: [
              "machine translation@en .",
              "neural machine translation@en .",
              "sequence to sequence@en .",
            ],
          },
          children: [
            {
              paper_id: "2401.60011",
              assignment: { score: 1.0, was_reexpressed: false },
            },
            {
              paper_id: "2402.60022",
              assignment: { score: 0.8, was_reexpressed: false },
            },
          ],
        },
      ],
    },
  ],
};

// API 응답을 내부 그래프 데이터 구조로 변환
function parseData(data) {
  return (data?.roots ?? []).map((root) => ({
    id: root.arxiv_primary_category,
    label: root.arxiv_primary_category,
    topics: (root.intermediate_nodes ?? []).map((node) => {
      const pathParts = (node.node_id ?? node.id ?? "").split("::");
      return {
        id: node.node_id ?? node.id,
        label: node.label,
        path: pathParts.slice(1, -1),
        keywords: node.cfo?.initial_keywords || [],
        papers: node.children || [],
      };
    }),
  }));
}

// 서버 응답 형태가 다를 수 있어 roots 위치를 여러 경로에서 탐색
function resolveRoadmapData(data) {
  return (
    data?.roots ? data :
    data?.data?.roots ? data.data :
    data?.roadmap?.roots ? data.roadmap :
    data?.data?.roadmap?.roots ? data.data.roadmap :
    null
  );
}

// ─── 레이아웃 상수 ───────────────────────────────────────
const ROOT_W = 120;
const ROOT_H = 120;
const TOPIC_W = 156;
const TOPIC_H = 40;
const PAPER_W = 160;
const PAPER_H = 72;
const TOPIC_RADIUS = 350;
const SPREAD_ANGLE = Math.PI * 1.2; // 216° 부채꼴로 논문 노드 배치

// 두 노드의 좌표를 보고 가장 자연스러운 연결 방향(handle) 결정
function getHandleDir(fromX, fromY, toX, toY) {
  const a = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;
  if (a > -45 && a <= 45) return { src: "right", tgt: "left" };
  if (a > 45 && a <= 135) return { src: "bottom", tgt: "top" };
  if (a > 135 || a <= -135) return { src: "left", tgt: "right" };
  return { src: "top", tgt: "bottom" };
}

// 모든 노드에 상하좌우 handle을 붙여 어느 방향으로든 엣지 연결 가능하게 함
const ALL_DIRS = [
  { pos: Position.Top, dir: "top" },
  { pos: Position.Bottom, dir: "bottom" },
  { pos: Position.Left, dir: "left" },
  { pos: Position.Right, dir: "right" },
];

function AllHandles() {
  return ALL_DIRS.map(({ pos, dir }) => (
    <React.Fragment key={dir}>
      <Handle
        type="source"
        position={pos}
        id={`src-${dir}`}
        style={{ opacity: 0 }}
        isConnectable={false}
      />
      <Handle
        type="target"
        position={pos}
        id={`tgt-${dir}`}
        style={{ opacity: 0 }}
        isConnectable={false}
      />
    </React.Fragment>
  ));
}

// ─── 커스텀 노드 컴포넌트 ────────────────────────────────

// 카테고리 루트 노드 (원형, 파란색)
function RootNode({ data }) {
  return (
    <div
      style={{ width: ROOT_W, height: ROOT_H }}
      className="rounded-full bg-linear-to-br from-[#5B8DEF] to-[#2B4CBF] flex flex-col items-center justify-center border-2 border-[#7BA7F7]/50 shadow-lg select-none"
    >
      <AllHandles />
      <span className="text-white font-bold text-sm font-mono text-center leading-snug px-2">
        {data.label.split(".")[0]}
        <br />.{data.label.split(".")[1] ?? ""}
      </span>
      <span className="text-[#BFD0FF] text-[9px] tracking-widest mt-1">
        ROOT
      </span>
    </div>
  );
}

// 토픽 노드 — 클릭 시 논문 펼치기, 펼쳐진 상태면 보라색으로 강조
function TopicNode({ data }) {
  return (
    <div
      style={{ width: TOPIC_W, height: TOPIC_H }}
      className={`relative flex items-center justify-center rounded-full cursor-pointer transition-colors select-none
        ${
          data.isExpanded
            ? "bg-[#4338CA] shadow-lg shadow-indigo-500/30"
            : "bg-[#1E293B] hover:bg-[#334155]"
        }`}
    >
      <AllHandles />
      <span className="text-white text-[11.5px] font-medium px-4 truncate">
        {data.label}
      </span>
      {/* 논문 수 뱃지 */}
      {data.paperCount > 0 && (
        <div
          className={`absolute -top-2 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white
            ${data.isExpanded ? "bg-[#818CF8]" : "bg-[#6366F1]"}`}
        >
          {data.paperCount}
        </div>
      )}
    </div>
  );
}

// 논문 노드 — 관련도 점수(score)에 따라 색상 다르게 표시
function PaperNode({ data }) {
  const score = data.score ?? 0;
  // 점수 0.8 이상: 초록, 0.5 이상: 노랑, 미만: 빨강
  const scoreStyle =
    score >= 0.8
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : score >= 0.5
        ? "text-amber-600 bg-amber-50 border-amber-200"
        : "text-red-600 bg-red-50 border-red-200";

  return (
    <div
      style={{ width: PAPER_W }}
      className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md hover:border-[#6366F1]/40 transition-all cursor-pointer"
    >
      <AllHandles />
      {data.title ? (
        <p className="text-[10px] font-medium text-[#1E293B] leading-snug line-clamp-2">
          {data.title}
        </p>
      ) : (
        <p className="text-[10px] font-mono font-semibold text-[#334155] truncate">
          arXiv:{data.paperId}
        </p>
      )}
      {/* score가 0.1보다 낮으면 표시 생략 (노이즈 제거) */}
      {score > 0.1 && (
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${scoreStyle}`}
          >
            {score.toFixed(1)}
          </span>
          {data.wasReexpressed && (
            <span className="text-[9px] text-[#94A3B8] italic">re-exp</span>
          )}
        </div>
      )}
    </div>
  );
}

const nodeTypes = {
  rootNode: RootNode,
  topicNode: TopicNode,
  paperNode: PaperNode,
};

// 루트 + 방사형 토픽 노드 초기 배치 생성
function buildInitialGraph(root) {
  const n = root.topics.length;
  const topicAngles = {};

  const nodes = [
    {
      id: root.id,
      type: "rootNode",
      position: { x: -ROOT_W / 2, y: -ROOT_H / 2 },
      data: { label: root.label },
      selectable: false,
      draggable: false,
    },
  ];

  const edges = [];

  // 토픽 노드를 원형으로 균등 배치
  root.topics.forEach((topic, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    topicAngles[topic.id] = angle;
    const tx = Math.cos(angle) * TOPIC_RADIUS;
    const ty = Math.sin(angle) * TOPIC_RADIUS;

    nodes.push({
      id: topic.id,
      type: "topicNode",
      position: { x: tx - TOPIC_W / 2, y: ty - TOPIC_H / 2 },
      data: {
        label: topic.label,
        paperCount: topic.papers.length,
        isExpanded: false,
      },
    });

    const { src, tgt } = getHandleDir(0, 0, tx, ty);
    edges.push({
      id: `e-root-${topic.id}`,
      source: root.id,
      target: topic.id,
      sourceHandle: `src-${src}`,
      targetHandle: `tgt-${tgt}`,
      style: { stroke: "#CBD5E1", strokeWidth: 1.5, strokeDasharray: "5 4" },
    });
  });

  return { nodes, edges, topicAngles };
}

// 토픽 클릭 시 논문 노드와 엣지를 부채꼴 형태로 생성
function buildExpansion(topic, angle, paperMap = {}) {
  const papers = topic.papers;
  if (!papers.length) return { nodes: [], edges: [] };

  const n = papers.length;
  const tx = Math.cos(angle) * TOPIC_RADIUS;
  const ty = Math.sin(angle) * TOPIC_RADIUS;

  // 논문이 많을수록 반경을 키워 겹치지 않게 조정
  const paperRadius = Math.max(180, (n * (PAPER_W + 20)) / SPREAD_ANGLE);

  const nodes = [];
  const edges = [];

  papers.forEach((paper, i) => {
    // 논문 1개면 토픽 방향 그대로, 여러 개면 부채꼴로 분산
    const paperAngle =
      n === 1 ? angle : angle - SPREAD_ANGLE / 2 + (SPREAD_ANGLE * i) / (n - 1);
    const px = tx + Math.cos(paperAngle) * paperRadius;
    const py = ty + Math.sin(paperAngle) * paperRadius;
    const id = `paper-${paper.paper_id}`;
    const localData = paperMap[paper.paper_id];

    nodes.push({
      id,
      type: "paperNode",
      position: { x: px - PAPER_W / 2, y: py - PAPER_H / 2 },
      data: {
        paperId: paper.paper_id,
        title: localData?.title ?? null,
        score: paper.assignment?.score ?? 0,
        wasReexpressed: paper.assignment?.was_reexpressed ?? false,
        topicLabel: topic.label,
      },
    });

    const { src, tgt } = getHandleDir(tx, ty, px, py);
    edges.push({
      id: `e-${topic.id}-${paper.paper_id}`,
      source: topic.id,
      target: id,
      sourceHandle: `src-${src}`,
      targetHandle: `tgt-${tgt}`,
      style: { stroke: "#818CF8", strokeWidth: 1.2 },
    });
  });

  return { nodes, edges };
}

// ReactFlow 상태 및 노드 클릭 이벤트를 관리하는 공유 훅
// ReactFlowProvider 내부에서만 호출 가능 (useReactFlow 사용)
function useRoadmapFlow(root, onPaperClick, paperMap = {}) {
  const { fitView } = useReactFlow();
  const [expandedId, setExpandedId] = useState(null);

  const {
    nodes: initNodes,
    edges: initEdges,
    topicAngles,
  } = useMemo(() => buildInitialGraph(root), [root]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  // root가 바뀌면 그래프 초기화
  useEffect(() => {
    setExpandedId(null);
    setNodes(initNodes);
    setEdges(initEdges);
  }, [initNodes, initEdges, setNodes, setEdges]);

  const onNodeClick = useCallback((_, node) => {
    if (node.type === "topicNode") {
      // 같은 토픽 클릭 시 토글 (접기/펼치기)
      setExpandedId((prev) => (prev === node.id ? null : node.id));
    } else if (node.type === "paperNode" && onPaperClick) {
      onPaperClick(node.data.paperId, node.data.topicLabel);
    }
  }, [onPaperClick]);

  // expandedId 변경 시 논문 노드/엣지 동기화
  useEffect(() => {
    const topic = expandedId
      ? root.topics.find((t) => t.id === expandedId)
      : null;
    const expansion = topic
      ? buildExpansion(topic, topicAngles[expandedId], paperMap)
      : { nodes: [], edges: [] };

    setNodes((nds) => [
      ...nds
        .filter((n) => n.type !== "paperNode")
        .map((n) =>
          n.type === "topicNode"
            ? { ...n, data: { ...n.data, isExpanded: n.id === expandedId } }
            : n,
        ),
      ...expansion.nodes,
    ]);

    setEdges((eds) => [
      ...eds
        .filter((e) => e.id.startsWith("e-root-"))
        .map((e) => ({
          ...e,
          // 펼쳐진 토픽은 엣지를 강조 표시
          style: {
            stroke: e.target === expandedId ? "#6366F1" : "#CBD5E1",
            strokeWidth: e.target === expandedId ? 2.5 : 1.5,
            strokeDasharray: e.target === expandedId ? undefined : "5 4",
          },
        })),
      ...expansion.edges,
    ]);
  }, [expandedId, root, topicAngles, paperMap, setNodes, setEdges]);

  // 토픽 펼쳐지면 해당 영역으로 카메라 이동 (80ms delay로 노드 렌더링 후 실행)
  useEffect(() => {
    const topic = expandedId
      ? root.topics.find((t) => t.id === expandedId)
      : null;
    const nodeIds = topic
      ? [
          { id: expandedId },
          ...topic.papers.map((p) => ({ id: `paper-${p.paper_id}` })),
        ]
      : undefined;

    const timer = setTimeout(() => {
      fitView({ nodes: nodeIds, duration: 600, padding: 0.3 });
    }, 80);
    return () => clearTimeout(timer);
  }, [expandedId, root, fitView]);

  return { nodes, edges, onNodesChange, onEdgesChange, onNodeClick };
}

// 점유율 바 차트 색상 팔레트
const CHART_COLORS = [
  "#F59E0B", "#EAB308", "#EF4444", "#06B6D4",
  "#8B5CF6", "#10B981", "#3B82F6", "#F97316",
];

// GAP 분석 결과 JSON 파싱 — 마크다운 코드블록이 포함되어 있을 수 있어 제거 후 파싱
function parseGapContent(content) {
  if (!content) return [];
  const tryParse = (val) => {
    if (typeof val !== "string") return val;
    // ```json ... ``` 형식 제거
    const stripped = val.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    try { return JSON.parse(stripped); } catch { return null; }
  };
  const parsed = tryParse(content);
  if (!parsed) return [{ title: "분석 결과", description: content }];

  const normalise = (item) => ({
    title: item.title ?? item.proposed_direction?.slice(0, 60) ?? `제안 ${item.id ?? ""}`,
    description: item.description ?? "",
    backgroundAndGap: item.background_and_gap ?? null,
    proposedDirection: item.proposed_direction ?? null,
    expectedContribution: item.expected_contribution ?? null,
    referencePapers: item.reference_papers ?? [],
    noveltyAssessment: item.novelty_assessment ?? null,
  });

  // 응답 배열 구조가 다를 수 있어 여러 키로 시도
  if (Array.isArray(parsed)) return parsed.map(normalise);
  if (Array.isArray(parsed?.future_work_proposals)) return parsed.future_work_proposals.map(normalise);
  if (Array.isArray(parsed?.future_work)) return parsed.future_work.map(normalise);
  if (Array.isArray(parsed?.recommendations)) return parsed.recommendations.map(normalise);
  if (Array.isArray(parsed?.ideas)) return parsed.ideas.map(normalise);
  return [{ title: "분석 결과", description: content }];
}

// 북마크 아이콘 — filled 여부에 따라 채워진/빈 아이콘 전환
function BookmarkIcon({ filled }) {
  return filled ? (
    <svg className="w-4 h-4 text-[#4F46E5]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3h14a1 1 0 011 1v17.438l-8-3.2-8 3.2V4a1 1 0 011-1z" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-[#94A3B8] hover:text-[#4F46E5] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a1 1 0 011 1v17.438l-8-3.2-8 3.2V4a1 1 0 011-1z" />
    </svg>
  );
}

// 갭 분석 실행할 논문을 선택하는 모달 (10~15개 권장)
function PaperSelectModal({ papers, selectedIds, onToggle, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[580px] max-w-[92vw] max-h-[75vh] flex flex-col"
        style={{ animation: "scaleIn 0.18s ease-out" }}>
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1E293B]">논문선택</h3>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] transition-colors text-[#94A3B8]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">퓨쳐워크를 탐색할 논문 10~15개를 선택해주세요.</p>
        </div>

        {/* 논문 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-2 paper-scroll">
          {papers.length === 0 && (
            <p className="text-xs text-[#94A3B8] text-center py-10">표시할 논문이 없습니다.</p>
          )}
          {papers.map((paper) => {
            const id = paper.paper_id ?? paper.arxiv_id ?? "";
            const isSelected = selectedIds.has(id);
            const keywords = (paper.categories ?? paper.arxiv_categories ?? []).slice(0, 4);
            return (
              <div
                key={id}
                onClick={() => onToggle(id)}
                className={`flex items-start justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors mb-1 ${
                  isSelected ? "bg-gray-200/50" : "hover:bg-gray-100/60"
                }`}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-sm font-medium text-[#1E293B] leading-snug truncate">
                    {paper.title ?? `arXiv:${id}`}
                  </p>
                  {keywords.length > 0 && (
                    <p className="text-xs text-[#64748B] mt-0.5 truncate">{keywords.join(" · ")}</p>
                  )}
                </div>
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  {isSelected && (
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-3 border-t border-[#F1F5F9] flex justify-end">
          <button
            onClick={onConfirm}
            className="text-sm font-semibold px-5 py-2 rounded-xl bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-colors"
          >
            {selectedIds.size > 0 ? `(${selectedIds.size}) 탐색` : "탐색"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 갭 아이디어 상세 정보 모달
function TopicDetailModal({ item, index, isBookmarked, onBookmark, onClose }) {
  // 구조화된 필드가 있으면 섹션별로 나눠서 표시, 없으면 description으로 폴백
  const sections = item.backgroundAndGap || item.proposedDirection || item.expectedContribution
    ? [
        { label: "연구 공백", text: item.backgroundAndGap },
        { label: "제안 방향", text: item.proposedDirection },
        { label: "기대 기여", text: item.expectedContribution },
      ]
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[580px] max-w-[92vw] p-6 max-h-[80vh] overflow-y-auto"
        style={{ animation: "scaleIn 0.18s ease-out" }}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#1E293B] leading-snug">
              연구 제안 {index + 1}
            </h3>
            {item.referencePapers?.length > 0 && (
              <p className="text-[11px] text-[#6366F1] mt-1">
                참조: {item.referencePapers.join(", ")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {item.noveltyAssessment && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                {item.noveltyAssessment}
              </span>
            )}
            <button onClick={onBookmark} className="p-1">
              <BookmarkIcon filled={isBookmarked} />
            </button>
            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] text-[#94A3B8]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        {sections ? (
          <div className="flex flex-col gap-3">
            {sections.filter(s => s.text).map((s) => (
              <div key={s.label}>
                <p className="text-[11px] font-semibold text-[#6366F1] mb-1">{s.label}</p>
                <p className="text-xs text-[#475569] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#475569] leading-relaxed">
            {item.description ?? item.content ?? "상세 내용이 없습니다."}
          </p>
        )}
      </div>
    </div>
  );
}

// 논문 클릭 시 오른쪽에서 슬라이드 인하는 상세 패널
function PaperSidePanel({ paperId, topicLabel, detail, loading, isBookmarked, onBookmark, onClose }) {
  const title = detail?.title ?? null;
  const topic = detail?.privaryCategory ?? detail?.categories ?? topicLabel ?? null;
  const summary = detail?.abstracts ?? null;
  const author = detail?.author ?? null;

  return (
    <>
      {/* 배경 클릭 시 패널 닫기 */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-full w-[400px] max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col border-l border-[#E2E8F0]"
        style={{ animation: "slideInRight 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-[#F1F5F9]">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="h-4 w-3/4 bg-[#F1F5F9] rounded animate-pulse" />
            ) : (
              <h2 className="text-sm font-bold text-[#1E293B] leading-snug">
                {title ?? `arXiv:${paperId}`}
              </h2>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
            <button onClick={onBookmark} className="p-1 rounded hover:bg-[#F1F5F9] transition-colors">
              <BookmarkIcon filled={isBookmarked} />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] transition-colors text-[#94A3B8]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto paper-scroll px-6 py-5 flex flex-col gap-5">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[100, 80, 60, 90, 70].map((w, i) => (
                <div key={i} className="h-3 bg-[#F1F5F9] rounded animate-pulse" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : (
            <>
              {topic && (
                <div>
                  <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-1.5">토픽</p>
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5]">
                    {topic}
                  </span>
                </div>
              )}
              {author && (
                <div>
                  <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-1.5">저자</p>
                  <p className="text-xs text-[#475569]">{author}</p>
                </div>
              )}
              {summary ? (
                <div>
                  <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-1.5">요약</p>
                  <p className="text-xs text-[#475569] leading-relaxed">{summary}</p>
                </div>
              ) : (
                !loading && (
                  <p className="text-xs text-[#94A3B8] italic">요약 정보가 없습니다.</p>
                )
              )}
            </>
          )}
        </div>

        {/* Footer — arXiv 원문 링크 */}
        <div className="px-6 py-4 border-t border-[#F1F5F9]">
          <a
            href={`https://arxiv.org/abs/${paperId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            원 논문 보기 — arXiv:{paperId}
          </a>
        </div>
      </div>
    </>
  );
}

// 실제 ReactFlow를 렌더링하는 내부 컴포넌트 (ReactFlowProvider 내에서 사용)
function RoadmapFlow({ root, roots, searchQuery, generatedAt, apiError, papers }) {
  // paper_id → 논문 전체 데이터 맵 (노드 렌더링 시 제목 표시용)
  const paperMap = useMemo(() => {
    const map = {};
    for (const p of papers) {
      const id = p.paper_id ?? p.arxiv_id ?? "";
      if (id) map[id] = p;
    }
    return map;
  }, [papers]);

  const [selectedPaper, setSelectedPaper] = useState(null); // { paperId, topicLabel }
  const [paperDetail, setPaperDetail] = useState(null);
  const [paperLoading, setPaperLoading] = useState(false);
  const [paperBookmarked, setPaperBookmarked] = useState(new Set());

  // 논문 노드 클릭 시 상세 정보 API 호출
  const handlePaperClick = useCallback(async (paperId, topicLabel) => {
    setSelectedPaper({ paperId, topicLabel });
    setPaperDetail(null);
    setPaperLoading(true);
    try {
      const detail = await paperApi.getPaperDetail(paperId);
      setPaperDetail(detail);
    } catch {
      // API 실패 시 paperMap의 로컬 데이터로 폴백
      const local = paperMap[paperId];
      setPaperDetail(local ? {
        paperId,
        title: local.title,
        abstracts: local.abstract,
        author: Array.isArray(local.authors) ? local.authors.join(", ") : (local.submitter ?? null),
        categories: Array.isArray(local.categories) ? local.categories.join(", ") : local.categories,
        privaryCategory: local.primary_category ?? (Array.isArray(local.categories) ? local.categories[0] : null),
      } : { paperId });
    } finally {
      setPaperLoading(false);
    }
  }, [paperMap]);

  // 논문 북마크 토글 — 낙관적 UI 업데이트 후 API 실패 시 롤백
  const togglePaperBookmark = useCallback(async (paperId, title, category) => {
    const isBookmarked = paperBookmarked.has(paperId);
    setPaperBookmarked((prev) => {
      const next = new Set(prev);
      isBookmarked ? next.delete(paperId) : next.add(paperId);
      return next;
    });
    try {
      if (isBookmarked) {
        await bookmarksApi.removePaperBookmark(paperId);
      } else {
        await bookmarksApi.addPaperBookmark({
          paperId,
          title: title ?? paperId,
          category: category ?? "",
        });
      }
    } catch {
      // 실패 시 이전 상태로 롤백
      setPaperBookmarked((prev) => {
        const next = new Set(prev);
        isBookmarked ? next.add(paperId) : next.delete(paperId);
        return next;
      });
    }
  }, [paperBookmarked]);

  const { nodes, edges, onNodesChange, onEdgesChange, onNodeClick } =
    useRoadmapFlow(root, handlePaperClick, paperMap);

  const totalPapers = root.topics.reduce((s, t) => s + t.papers.length, 0);

  // 토픽별 논문 수 분포 데이터 (바 차트용)
  const distribution = useMemo(
    () =>
      root.topics
        .map((t, i) => ({
          label: t.label,
          count: t.papers.length,
          color: CHART_COLORS[i % CHART_COLORS.length],
        }))
        .filter((d) => d.count > 0),
    [root]
  );
  const distTotal = distribution.reduce((s, d) => s + d.count, 0);
  const distMax = Math.max(...distribution.map((d) => d.count), 1);

  // GAP 분석 관련 상태
  const [gapItems, setGapItems] = useState([]);
  const [gapLoading, setGapLoading] = useState(false);
  const [gapError, setGapError] = useState("");
  const [bookmarked, setBookmarked] = useState(new Set());
  const [bookmarkIdMap, setBookmarkIdMap] = useState({}); // 로컬 인덱스 → 서버 북마크 ID
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [detailItem, setDetailItem] = useState(null);

  const togglePaper = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // 선택한 논문 ID로 GAP 분석 API 호출
  const runGapAnalysis = useCallback(async (ids) => {
    const paperIds = [...ids];
    setShowPaperModal(false);
    setGapLoading(true);
    setGapError("");
    setGapItems([]);
    try {
      const selectedPapers = papers.filter((p) => ids.has(p.paper_id ?? p.arxiv_id ?? ""));
      // 선택 논문을 서버에 먼저 전달 (실패해도 갭 분석은 계속 진행)
      if (selectedPapers.length > 0) {
        await paperApi.selectPapers(selectedPapers).catch(() => {});
      }
      const result = await gapApi.refreshRecommendations({ paperIds });
      setGapItems(parseGapContent(result?.gapContent ?? result));
    } catch {
      setGapError("GAP 분석에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setGapLoading(false);
    }
  }, [papers]);

  const handleConfirm = useCallback(() => {
    if (!selectedIds.size) return;
    runGapAnalysis(selectedIds);
  }, [selectedIds, runGapAnalysis]);

  // GAP 아이디어 북마크 토글 — 낙관적 업데이트 후 서버 ID 저장
  const toggleBookmark = useCallback(async (i) => {
    const item = gapItems[i];
    if (!item) return;
    if (bookmarked.has(i)) {
      const backendId = bookmarkIdMap[i];
      setBookmarked((prev) => { const n = new Set(prev); n.delete(i); return n; });
      if (backendId) {
        bookmarksApi.removeGapBookmark(backendId).catch(() => {});
        setBookmarkIdMap((prev) => { const n = { ...prev }; delete n[i]; return n; });
      }
    } else {
      setBookmarked((prev) => { const n = new Set(prev); n.add(i); return n; });
      try {
        const res = await bookmarksApi.addGapBookmark({
          title: item.title ?? item.name ?? "Gap 아이디어",
          content: JSON.stringify(item),
          keyword: searchQuery ?? "",
        });
        // 서버에서 받은 ID를 저장해두어야 나중에 삭제 시 사용 가능
        if (res?.id) setBookmarkIdMap((prev) => ({ ...prev, [i]: res.id }));
      } catch {}
    }
  }, [bookmarked, bookmarkIdMap, gapItems, searchQuery]);

  return (
    <div className="mx-auto max-w-screen-3xl px-8 py-8 flex flex-col gap-6">
      {/* 헤더 — 검색 키워드가 있으면 강조 표시 */}
      <div>
        <h1 className="text-lg font-bold text-[#173355]">Research Roadmap</h1>
        <p className="mt-1 text-sm text-[#466084]">
          {searchQuery ? (
            <>
              <span className="font-semibold text-[#1D4ED8]">"{searchQuery}"</span>
              {" "}검색 결과 로드맵입니다.
            </>
          ) : (
            "연구 주제의 계층적 구조를 탐색하고 관련 논문을 확인하세요"
          )}
        </p>
      </div>

      {/* 통계 뱃지 */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E2E8F0] px-4 py-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#3B5BDB]" />
          <span className="text-xs font-medium text-[#334155]">카테고리</span>
          <span className="text-xs font-bold text-[#3B5BDB]">
            {roots.length}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E2E8F0] px-4 py-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <span className="text-xs font-medium text-[#334155]">토픽 노드</span>
          <span className="text-xs font-bold text-[#6366F1]">
            {root.topics.length}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E2E8F0] px-4 py-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-[#334155]">총 논문</span>
          <span className="text-xs font-bold text-emerald-600">
            {totalPapers}
          </span>
        </div>
        <span className="text-xs text-[#94A3B8] ml-auto">
          생성일:{" "}
          {new Date(generatedAt).toLocaleDateString("ko-KR")}
        </span>
      </div>

      {/* API 실패 경고 배너 */}
      {apiError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {apiError}
        </div>
      )}

      {/* ReactFlow 그래프 */}
      <div
        className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden"
        style={{ height: "calc(100vh - 260px)", minHeight: "500px" }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#6366F1]"
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
            <span className="font-semibold text-[#1E293B] text-sm">
              연구 로드맵
            </span>
          </div>
          <span className="text-xs text-[#94A3B8]">
            토픽 노드를 클릭하여 논문을 펼쳐보세요
          </span>
        </div>
        <div style={{ height: "calc(100% - 57px)" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            minZoom={0.15}
            maxZoom={2.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#E2E8F0" gap={20} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </div>

      {/* 하단: 점유율 바 차트 + GAP 추천 */}
      <div className="flex gap-6">
        {/* 토픽별 논문 수 바 차트 */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6" style={{ flex: "0 0 44%" }}>
          <h3 className="text-sm font-semibold text-[#1E293B] mb-5">해당 계층까지의 점유율</h3>
          <div className="flex items-end justify-center gap-5 h-36 mb-4">
            {distribution.map((d) => (
              <div key={d.label} className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-[#334155]">{d.count}</span>
                <div
                  style={{
                    // 최댓값 기준 상대 높이 계산, 최소 8px 보장
                    height: `${Math.max((d.count / distMax) * 112, 8)}px`,
                    backgroundColor: d.color,
                    width: "48px",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="border-t border-[#F1F5F9] pt-3">
            <p className="text-xs text-[#64748B]">
              총 집계된 논문 수:{" "}
              <span className="font-bold text-[#3B82F6]">{distTotal}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
              {distribution.map((d) => (
                <div key={d.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-[#64748B]">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CLIP 갭 아이디어 추천 패널 */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#1E293B]">CLIP의 추천 아이디어</h3>
            {/* 결과가 있을 때만 재추천 버튼 표시 */}
            {gapItems.length > 0 && (
              <button
                onClick={() => setShowPaperModal(true)}
                disabled={gapLoading}
                className="text-xs px-3 py-1.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-medium hover:bg-[#E0E7FF] transition-colors disabled:opacity-50"
              >
                주제 재추천
              </button>
            )}
          </div>

          {/* 초기 상태 — 아직 분석 안 함 */}
          {!gapLoading && !gapItems.length && !gapError && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6">
              <div className="mt-2">
                <button
                  onClick={() => setShowPaperModal(true)}
                  className="text-sm font-semibold px-6 py-2.5 rounded-xl bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-colors"
                >
                  논문들을 선택하여 퓨처워크를 탐색하세요
                </button>
              </div>
            </div>
          )}

          {/* 분석 중 로딩 스피너 */}
          {gapLoading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#94A3B8]">퓨쳐워크 아이디어를 분석하는 중입니다...</p>
            </div>
          )}

          {/* 에러 상태 */}
          {gapError && !gapLoading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <p className="text-xs text-red-500">{gapError}</p>
              <button
                onClick={() => setShowPaperModal(true)}
                className="text-xs px-4 py-2 rounded-lg bg-[#EEF2FF] text-[#4F46E5] font-medium hover:bg-[#E0E7FF] transition-colors"
              >
                다시 탐색하기
              </button>
            </div>
          )}

          {/* 분석 결과 목록 */}
          {!gapLoading && gapItems.length > 0 && (
            <div className="flex flex-col gap-2.5 overflow-y-auto paper-scroll" style={{ maxHeight: "280px" }}>
              {gapItems.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setDetailItem({ item, index: i })}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-3 cursor-pointer hover:border-[#C7D2FE] hover:bg-[#FAFAFF] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1E293B] truncate">
                        {i + 1}. {item.title ?? item.name ?? "추천 아이디어"}
                      </p>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-1">
                        {item.backgroundAndGap ?? item.description ?? item.content ?? ""}
                      </p>
                    </div>
                    {/* 클릭이 행 클릭과 겹치지 않도록 stopPropagation */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(i); }}
                      className="flex-shrink-0 p-0.5 mt-0.5"
                    >
                      <BookmarkIcon filled={bookmarked.has(i)} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 논문 선택 모달 */}
      {showPaperModal && (
        <PaperSelectModal
          papers={papers}
          selectedIds={selectedIds}
          onToggle={togglePaper}
          onConfirm={handleConfirm}
          onClose={() => setShowPaperModal(false)}
        />
      )}

      {/* 갭 아이디어 상세 모달 */}
      {detailItem && (
        <TopicDetailModal
          item={detailItem.item}
          index={detailItem.index}
          isBookmarked={bookmarked.has(detailItem.index)}
          onBookmark={() => toggleBookmark(detailItem.index)}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* 논문 상세 사이드 패널 */}
      {selectedPaper && (
        <PaperSidePanel
          paperId={selectedPaper.paperId}
          topicLabel={selectedPaper.topicLabel}
          detail={paperDetail}
          loading={paperLoading}
          isBookmarked={paperBookmarked.has(selectedPaper.paperId)}
          onBookmark={() => togglePaperBookmark(selectedPaper.paperId, paperDetail?.title, paperDetail?.primaryCategory)}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </div>
  );
}

// 홈 페이지 대시보드 내 로드맵 미리보기 컴포넌트 (인터랙션 최소화)
function PreviewFlowInner({ root, onInit }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onNodeClick } =
    useRoadmapFlow(root);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      onInit={onInit}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      minZoom={0.1}
      maxZoom={2.5}
      // 홈에서는 스크롤/패닝 비활성화 — 실수로 드래그되는 것 방지
      zoomOnScroll={false}
      panOnScroll={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#E2E8F0" gap={20} />
    </ReactFlow>
  );
}

// 홈 페이지에서 import하여 사용하는 로드맵 미리보기 컴포넌트
export function RoadmapPreview({ onInit, onKeywordLoad }) {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLastRoadmap() {
      try {
        // 1단계: 마지막 검색 키워드 확인 (서버 기록 우선, 실패 시 localStorage)
        let lastKeyword = null;
        try {
          const histData = await historyApi.getHistory();
          const list = Array.isArray(histData)
            ? histData
            : histData?.data ?? histData?.content ?? histData?.histories ?? [];
          const first = list[0];
          lastKeyword = first?.keyword ?? first?.query ?? first?.searchWord ?? null;
        } catch {
          const local = JSON.parse(localStorage.getItem("clip_recent_searches") ?? "[]");
          lastKeyword = local[0]?.query ?? null;
        }

        if (lastKeyword) onKeywordLoad?.(lastKeyword);

        // 키워드 없으면 샘플 데이터 표시
        if (!lastKeyword) {
          setRoadmapData(SAMPLE_DATA);
          return;
        }

        // 2단계: 마지막 키워드로 로드맵 API 호출
        const data = await roadmapApi.getRoadmap({ keyword: lastKeyword });
        const resolved = resolveRoadmapData(data);
        setRoadmapData(resolved ?? SAMPLE_DATA);
      } catch {
        setRoadmapData(SAMPLE_DATA);
      } finally {
        setLoading(false);
      }
    }
    loadLastRoadmap();
  }, []);

  const roots = useMemo(() => parseData(roadmapData ?? SAMPLE_DATA), [roadmapData]);
  const root = roots[0] ?? null;

  if (loading || !root) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 text-[#CBD5E1] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-xs text-[#94A3B8]">로드맵 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <PreviewFlowInner root={root} onInit={onInit} />
    </ReactFlowProvider>
  );
}

// 로드맵 페이지 — 검색 결과나 API 응답으로 받은 로드맵 데이터를 시각화
function Roadmap() {
  const { state } = useLocation();
  const searchQuery = state?.query ?? null;
  // Research 페이지에서 넘어온 검색 결과가 있으면 우선 사용
  const initialData = resolveRoadmapData(state?.searchResult) ?? SAMPLE_DATA;
  const [roadmapData, setRoadmapData] = useState(initialData);
  const [apiError, setApiError] = useState("");
  const [apiPapers, setApiPapers] = useState([]);
  const roots = useMemo(() => parseData(roadmapData), [roadmapData]);

  // root가 여럿이면 토픽을 하나로 합쳐 단일 루트처럼 표시
  const root = useMemo(() => {
    if (roots.length <= 1) return roots[0] ?? null;
    return {
      id: roots[0].id,
      label: roots[0].label,
      topics: roots.flatMap((r) =>
        r.topics.map((t) => ({ ...t, label: r.id }))
      ),
    };
  }, [roots]);

  // 논문 데이터 우선순위: 검색 결과 → API 응답 → 로드맵 노드에서 추출
  const papers = useMemo(() => {
    const searchPapers = state?.searchResult?.papers;
    if (searchPapers?.length > 0) return searchPapers;
    if (apiPapers.length > 0) return apiPapers;
    // 로드맵 노드에서 paper_id만 추출 (중복 제거)
    const seen = new Set();
    const list = [];
    for (const r of (roadmapData?.roots ?? [])) {
      for (const node of (r.intermediate_nodes ?? [])) {
        for (const child of (node.children ?? [])) {
          const id = child.paper_id;
          if (id && !seen.has(id)) {
            seen.add(id);
            list.push({ paper_id: id });
          }
        }
      }
    }
    return list;
  }, [roadmapData, state?.searchResult?.papers, apiPapers]);

  useEffect(() => {
    let ignore = false;
    const stateData = resolveRoadmapData(state?.searchResult);

    // 검색 결과가 이미 있으면 API 재호출 불필요
    if (stateData) {
      setRoadmapData(stateData);
      setApiError("");
      return () => {
        ignore = true;
      };
    }

    async function loadRoadmap() {
      try {
        const data = await roadmapApi.getRoadmap(
          searchQuery ? { keyword: searchQuery } : undefined,
        );
        const nextData = resolveRoadmapData(data);
        const responsePapers = data?.papers ?? data?.data?.papers ?? [];
        if (!ignore) {
          if (nextData) {
            setRoadmapData(nextData);
            setApiError("");
          }
          if (responsePapers.length > 0) {
            setApiPapers(responsePapers);
          }
        }
      } catch {
        if (!ignore) {
          // API 실패 시 샘플 데이터로 폴백 + 경고 배너 표시
          setRoadmapData(SAMPLE_DATA);
          setApiError("로드맵 API 연결에 실패하여 샘플 데이터를 표시합니다.");
        }
      }
    }

    loadRoadmap();
    return () => {
      ignore = true;
    };
  }, [searchQuery, state?.searchResult]);

  if (!root) {
    return (
      <div className="mx-auto max-w-screen-3xl px-8 py-8 text-sm text-[#64748B]">
        표시할 로드맵 데이터가 없습니다.
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <RoadmapFlow
        root={root}
        roots={roots}
        searchQuery={searchQuery}
        generatedAt={roadmapData.generated_at ?? new Date().toISOString()}
        apiError={apiError}
        papers={papers}
      />
    </ReactFlowProvider>
  );
}

export default Roadmap;

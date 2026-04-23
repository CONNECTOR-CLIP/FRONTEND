import React, { useState, useMemo, useCallback, useEffect } from "react";
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

/* ─── 샘플 데이터 (API로 수신 연결 필요) ─── */
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

/* ─── Data Parsing ─── */
function parseData(data) {
  return data.roots.map((root) => ({
    id: root.arxiv_primary_category,
    label: root.arxiv_primary_category,
    topics: root.intermediate_nodes.map((node) => {
      const pathParts = node.node_id.split("::");
      return {
        id: node.node_id,
        label: node.label,
        path: pathParts.slice(1, -1),
        keywords: node.cfo?.initial_keywords || [],
        papers: node.children || [],
      };
    }),
  }));
}

/* ─── Layout Constants ─── */
const ROOT_W = 120;
const ROOT_H = 120;
const TOPIC_W = 156;
const TOPIC_H = 40;
const PAPER_W = 148;
const PAPER_H = 56;
const TOPIC_RADIUS = 350;
const SPREAD_ANGLE = Math.PI * 1.2; // 216° 부채꼴

/* ─── 엣지 방향 결정 (최적 handle 선택) ─── */
function getHandleDir(fromX, fromY, toX, toY) {
  const a = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;
  if (a > -45 && a <= 45) return { src: "right", tgt: "left" };
  if (a > 45 && a <= 135) return { src: "bottom", tgt: "top" };
  if (a > 135 || a <= -135) return { src: "left", tgt: "right" };
  return { src: "top", tgt: "bottom" };
}

/* ─── 전방향 Handle (모든 노드 공용) ─── */
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

/* ─── Custom Nodes ─── */
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

function PaperNode({ data }) {
  const score = data.score ?? 0;
  const scoreStyle =
    score >= 0.8
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : score >= 0.5
        ? "text-amber-600 bg-amber-50 border-amber-200"
        : "text-red-600 bg-red-50 border-red-200";

  return (
    <a
      href={`https://arxiv.org/abs/${data.paperId}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ width: PAPER_W }}
      className="block bg-white border border-[#E2E8F0] rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md hover:border-[#6366F1]/40 transition-all cursor-pointer"
    >
      <AllHandles />
      <p className="text-[10px] font-mono font-semibold text-[#334155] truncate">
        arXiv:{data.paperId}
      </p>
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
    </a>
  );
}

const nodeTypes = {
  rootNode: RootNode,
  topicNode: TopicNode,
  paperNode: PaperNode,
};

/* ─── 초기 그래프 빌드 (root + 방사형 topic) ─── */
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

/* ─── Topic 클릭 시 paper 노드/엣지 생성 ─── */
function buildExpansion(topic, angle) {
  const papers = topic.papers;
  if (!papers.length) return { nodes: [], edges: [] };

  const n = papers.length;
  const tx = Math.cos(angle) * TOPIC_RADIUS;
  const ty = Math.sin(angle) * TOPIC_RADIUS;

  // paper 수에 따라 반경 동적 조정 (겹침 방지)
  const paperRadius = Math.max(180, (n * (PAPER_W + 20)) / SPREAD_ANGLE);

  const nodes = [];
  const edges = [];

  papers.forEach((paper, i) => {
    const paperAngle =
      n === 1 ? angle : angle - SPREAD_ANGLE / 2 + (SPREAD_ANGLE * i) / (n - 1);
    const px = tx + Math.cos(paperAngle) * paperRadius;
    const py = ty + Math.sin(paperAngle) * paperRadius;
    const id = `paper-${paper.paper_id}`;

    nodes.push({
      id,
      type: "paperNode",
      position: { x: px - PAPER_W / 2, y: py - PAPER_H / 2 },
      data: {
        paperId: paper.paper_id,
        score: paper.assignment?.score ?? 0,
        wasReexpressed: paper.assignment?.was_reexpressed ?? false,
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

/* ─── Inner Flow (useReactFlow 사용) ─── */
function RoadmapFlow({ root, roots }) {
  const { fitView } = useReactFlow();
  const [expandedId, setExpandedId] = useState(null);

  const {
    nodes: initNodes,
    edges: initEdges,
    topicAngles,
  } = useMemo(() => buildInitialGraph(root), [root]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  const onNodeClick = useCallback((_, node) => {
    if (node.type !== "topicNode") return;
    setExpandedId((prev) => (prev === node.id ? null : node.id));
  }, []);

  // expandedId 변경 → 노드/엣지 동기화
  useEffect(() => {
    const topic = expandedId
      ? root.topics.find((t) => t.id === expandedId)
      : null;
    const expansion = topic
      ? buildExpansion(topic, topicAngles[expandedId])
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
          style: {
            stroke: e.target === expandedId ? "#6366F1" : "#CBD5E1",
            strokeWidth: e.target === expandedId ? 2.5 : 1.5,
            strokeDasharray: e.target === expandedId ? undefined : "5 4",
          },
        })),
      ...expansion.edges,
    ]);
  }, [expandedId, root, topicAngles, setNodes, setEdges]);

  // 펼쳐진 topic 영역으로 카메라 포커스
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

  const totalPapers = root.topics.reduce((s, t) => s + t.papers.length, 0);

  return (
    <div className="mx-auto max-w-screen-3xl px-8 py-8 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#173355]">Research Roadmap</h1>
        <p className="mt-1 text-sm text-[#466084]">
          연구 주제의 계층적 구조를 탐색하고 관련 논문을 확인하세요
        </p>
      </div>

      {/* Stats */}
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
          {new Date(SAMPLE_DATA.generated_at).toLocaleDateString("ko-KR")}
        </span>
      </div>

      {/* Graph */}
      <div
        className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden"
        style={{ height: "calc(100vh - 260px)", minHeight: "600px" }}
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
    </div>
  );
}
/*jira test*/

/* ─── Roadmap Page ─── */
function Roadmap() {
  const roots = useMemo(() => parseData(SAMPLE_DATA), []);
  const root = roots[0];

  return (
    <ReactFlowProvider>
      <RoadmapFlow root={root} roots={roots} />
    </ReactFlowProvider>
  );
}

export default Roadmap;

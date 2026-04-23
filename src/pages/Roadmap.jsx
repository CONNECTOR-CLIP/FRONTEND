import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";

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
            { paper_id: "2412.03884", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2503.18018", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2505.02781", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2505.07315", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2505.13126", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2508.15358", assignment: { score: 0.1, was_reexpressed: false } },
            { paper_id: "2512.08296", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2602.03249", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2604.02022", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2604.05297", assignment: { score: 1.0, was_reexpressed: false } },
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
            { paper_id: "2301.00234", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2302.05442", assignment: { score: 0.9, was_reexpressed: false } },
            { paper_id: "2303.12980", assignment: { score: 0.8, was_reexpressed: false } },
            { paper_id: "2304.01373", assignment: { score: 1.0, was_reexpressed: false } },
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
            { paper_id: "2401.10011", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2402.10022", assignment: { score: 0.9, was_reexpressed: false } },
            { paper_id: "2403.10033", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2404.10044", assignment: { score: 0.7, was_reexpressed: true } },
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
            { paper_id: "2401.20011", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2402.20022", assignment: { score: 0.8, was_reexpressed: false } },
            { paper_id: "2405.20033", assignment: { score: 0.6, was_reexpressed: true } },
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
            { paper_id: "2401.30011", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2402.30022", assignment: { score: 0.9, was_reexpressed: false } },
            { paper_id: "2403.30033", assignment: { score: 0.7, was_reexpressed: false } },
            { paper_id: "2404.30044", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2501.30055", assignment: { score: 0.8, was_reexpressed: false } },
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
            { paper_id: "2401.40011", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2402.40022", assignment: { score: 0.8, was_reexpressed: false } },
            { paper_id: "2503.40033", assignment: { score: 1.0, was_reexpressed: false } },
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
            { paper_id: "2401.50011", assignment: { score: 0.9, was_reexpressed: false } },
            { paper_id: "2402.50022", assignment: { score: 0.7, was_reexpressed: false } },
            { paper_id: "2403.50033", assignment: { score: 1.0, was_reexpressed: false } },
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
            { paper_id: "2401.60011", assignment: { score: 1.0, was_reexpressed: false } },
            { paper_id: "2402.60022", assignment: { score: 0.8, was_reexpressed: false } },
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

/* ─── Node dimensions (dagre와 커스텀 노드 크기 일치) ─── */
const ROOT_W = 120;
const ROOT_H = 120;
const TOPIC_W = 156;
const TOPIC_H = 40;

/* ─── dagre 자동 레이아웃 ─── */
function getLayoutedElements(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", ranksep: 100, nodesep: 28 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => {
    g.setNode(n.id, {
      width: n.type === "rootNode" ? ROOT_W : TOPIC_W,
      height: n.type === "rootNode" ? ROOT_H : TOPIC_H,
    });
  });
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);

  return nodes.map((n) => {
    const { x, y } = g.node(n.id);
    const w = n.type === "rootNode" ? ROOT_W : TOPIC_W;
    const h = n.type === "rootNode" ? ROOT_H : TOPIC_H;
    return { ...n, position: { x: x - w / 2, y: y - h / 2 } };
  });
}

/* ─── Custom Nodes ─── */
function RootNode({ data }) {
  return (
    <div
      style={{ width: ROOT_W, height: ROOT_H }}
      className="rounded-full bg-linear-to-br from-[#5B8DEF] to-[#2B4CBF] flex flex-col items-center justify-center border-2 border-[#7BA7F7]/50 shadow-lg"
    >
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} isConnectable={false} />
      <span className="text-white font-bold text-sm font-mono text-center leading-snug px-2">
        {data.label.split(".")[0]}
        <br />.{data.label.split(".")[1] ?? ""}
      </span>
      <span className="text-[#BFD0FF] text-[9px] tracking-widest mt-1">ROOT</span>
    </div>
  );
}

function TopicNode({ data }) {
  return (
    <div
      style={{ width: TOPIC_W, height: TOPIC_H }}
      className={`relative flex items-center justify-center rounded-full cursor-pointer transition-colors
        ${data.isSelected
          ? "bg-[#4338CA] shadow-lg shadow-indigo-500/25"
          : "bg-[#1E293B] hover:bg-[#334155]"
        }`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} isConnectable={false} />
      <span className="text-white text-[11.5px] font-medium px-4 truncate">
        {data.label}
      </span>
      {data.paperCount > 0 && (
        <div
          className={`absolute -top-2 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white
            ${data.isSelected ? "bg-[#818CF8]" : "bg-[#6366F1]"}`}
        >
          {data.paperCount}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { rootNode: RootNode, topicNode: TopicNode };

/* ─── 그래프 노드/엣지 초기값 빌드 ─── */
function buildGraph(root) {
  const rawNodes = [
    {
      id: root.id,
      type: "rootNode",
      position: { x: 0, y: 0 },
      data: { label: root.label },
      selectable: false,
    },
    ...root.topics.map((topic) => ({
      id: topic.id,
      type: "topicNode",
      position: { x: 0, y: 0 },
      data: { label: topic.label, paperCount: topic.papers.length, isSelected: false },
    })),
  ];

  const rawEdges = root.topics.map((topic) => ({
    id: `e-${root.id}-${topic.id}`,
    source: root.id,
    target: topic.id,
    style: { stroke: "#CBD5E1", strokeWidth: 1.5, strokeDasharray: "5 4" },
  }));

  return { nodes: getLayoutedElements(rawNodes, rawEdges), edges: rawEdges };
}

/* ─── Paper Item ─── */
function PaperItem({ paper }) {
  const score = paper.assignment?.score ?? 0;
  const scoreStyle =
    score >= 0.8
      ? { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" }
      : score >= 0.5
        ? { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" }
        : { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" };

  return (
    <a
      href={`https://arxiv.org/abs/${paper.paper_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#334155] font-mono tracking-wide">
          arXiv:{paper.paper_id}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}>
            Score {score.toFixed(1)}
          </span>
          {paper.assignment?.was_reexpressed && (
            <span className="text-[10px] text-[#94A3B8] italic">re-expressed</span>
          )}
        </div>
      </div>
      <svg className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#6366F1] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

/* ─── Paper Side Panel ─── */
function PaperPanel({ topic }) {
  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
        <div className="w-14 h-14 rounded-full bg-[#EEF2FF] flex items-center justify-center">
          <svg className="w-7 h-7 text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-[#475569]">토픽 노드를 선택하세요</p>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
            그래프에서 노드를 클릭하면
            <br />관련 논문 목록이 표시됩니다
          </p>
        </div>
      </div>
    );
  }

  const highRelCount = topic.papers.filter((p) => (p.assignment?.score ?? 0) >= 0.8).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F1F5F9] shrink-0 bg-[#FAFBFF]">
        <h3 className="font-bold text-[#1E293B] text-sm leading-tight">{topic.label}</h3>
        {topic.path.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            {topic.path.map((part, i) => (
              <React.Fragment key={i}>
                <span className="text-[10px] text-[#94A3B8]">{part}</span>
                {i < topic.path.length - 1 && (
                  <span className="text-[10px] text-[#CBD5E1]">›</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <span className="text-[11px] font-semibold text-[#6366F1] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full">
            {topic.papers.length}편의 논문
          </span>
          {highRelCount > 0 && (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              고관련 {highRelCount}편
            </span>
          )}
        </div>
        {topic.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {topic.keywords.slice(0, 4).map((kw, i) => (
              <span key={i} className="text-[10px] text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                {kw.replace(/@en\s*\.?\s*$/, "").trim()}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {topic.papers.map((paper) => (
          <PaperItem key={paper.paper_id} paper={paper} />
        ))}
      </div>
    </div>
  );
}

/* ─── Roadmap Page ─── */
function Roadmap() {
  const [selectedId, setSelectedId] = useState(null);
  const roots = useMemo(() => parseData(SAMPLE_DATA), []);
  const root = roots[0];

  const { nodes: initNodes, edges: initEdges } = useMemo(() => buildGraph(root), [root]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.type === "topicNode"
          ? { ...n, data: { ...n.data, isSelected: n.id === selectedId } }
          : n
      )
    );
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: {
          stroke: e.target === selectedId ? "#6366F1" : "#CBD5E1",
          strokeWidth: e.target === selectedId ? 2.5 : 1.5,
          strokeDasharray: e.target === selectedId ? undefined : "5 4",
        },
      }))
    );
  }, [selectedId, setNodes, setEdges]);

  const onNodeClick = useCallback((_, node) => {
    if (node.type !== "topicNode") return;
    setSelectedId((prev) => (prev === node.id ? null : node.id));
  }, []);

  const selectedTopic = useMemo(() => {
    if (!selectedId || !root) return null;
    return root.topics.find((t) => t.id === selectedId) ?? null;
  }, [selectedId, root]);

  const totalPapers = root?.topics.reduce((sum, t) => sum + t.papers.length, 0) ?? 0;

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
          <span className="text-xs font-bold text-[#3B5BDB]">{roots.length}</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E2E8F0] px-4 py-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <span className="text-xs font-medium text-[#334155]">토픽 노드</span>
          <span className="text-xs font-bold text-[#6366F1]">{root?.topics.length ?? 0}</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E2E8F0] px-4 py-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-[#334155]">총 논문</span>
          <span className="text-xs font-bold text-emerald-600">{totalPapers}</span>
        </div>
        <span className="text-xs text-[#94A3B8] ml-auto">
          생성일: {new Date(SAMPLE_DATA.generated_at).toLocaleDateString("ko-KR")}
        </span>
      </div>

      {/* Main: Graph + Side Panel */}
      <div
        className="flex gap-6"
        style={{ height: "calc(100vh - 260px)", minHeight: "560px" }}
      >
        {/* Graph area */}
        <div className="flex-1 min-w-0 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#F1F5F9] shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-semibold text-[#1E293B] text-sm">연구 로드맵</span>
            </div>
            <span className="text-xs text-[#94A3B8]">노드를 클릭하여 논문을 탐색하세요</span>
          </div>
          <div className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.3}
              maxZoom={2}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#E2E8F0" gap={20} />
              <Controls showInteractive={false} />
              <MiniMap
                nodeColor={(n) => (n.type === "rootNode" ? "#3B5BDB" : "#1E293B")}
                maskColor="rgba(255,255,255,0.7)"
                style={{ border: "1px solid #E2E8F0", borderRadius: 8 }}
              />
            </ReactFlow>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-[340px] shrink-0 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-5 pt-5 pb-3 border-b border-[#F1F5F9] shrink-0">
            <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-semibold text-[#1E293B] text-sm">논문 목록</span>
            {selectedTopic && (
              <button
                onClick={() => setSelectedId(null)}
                className="ml-auto text-[11px] text-[#94A3B8] hover:text-[#334155] transition-colors"
              >
                닫기 ✕
              </button>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <PaperPanel topic={selectedTopic} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roadmap;

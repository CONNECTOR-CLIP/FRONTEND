import { useEffect, useState } from "react";
import { STATUS_COLOR, CONCERN_LABELS, VerdictBadge } from "@/components/verdict";

// 갭 분석 단계별 진행 패널 — AI 서버가 단계마다 남기는 검증 결과를 바로 시각화한다.
// stages: [{ stage, status: pending|running|done|skipped|failed, started_at, finished_at, data }]

const STAGE_INFO = {
  download: { label: "논문 준비", desc: "arXiv 원문(LaTeX) 다운로드" },
  CoT1: { label: "CoT1 · 목표 분해", desc: "논문별 연구 목표와 달성 상태 분석" },
  CoT2: { label: "CoT2 · 한계 추출", desc: "원문에서 한계 후보 추출 후 검증" },
  CoT3: { label: "CoT3 · 교차 비교", desc: "논문 간 연구 공백 후보 생성·검증" },
  FutureWork: { label: "Future Work 생성", desc: "검증된 후보로 연구 제안 5개 작성" },
  CoT4: { label: "CoT4 · 실현가능성", desc: "제안별 기술적 실현가능성 판정" },
  CoT5: { label: "CoT5 · 신규성", desc: "로컬 문헌 검색 기반 신규성 판정" },
};

const SUBGOAL_SEGMENTS = [
  { key: "achieved", label: "달성", color: STATUS_COLOR.good },
  { key: "partially_achieved", label: "부분 달성", color: STATUS_COLOR.warning },
  { key: "not_achieved", label: "미달성", color: STATUS_COLOR.critical },
];

function formatDuration(seconds) {
  if (seconds == null || seconds < 1) return "";
  const s = Math.round(seconds);
  if (s < 60) return `${s}초`;
  return `${Math.floor(s / 60)}분 ${s % 60}초`;
}

function firstSentence(text, max = 70) {
  if (!text) return "";
  const m = text.match(/^.+?[.。]/);
  const s = m ? m[0] : text;
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

// 단계 상태 아이콘: 대기(빈 원) / 진행(스피너) / 완료(체크) / 건너뜀(대시) / 실패(X)
function StageIcon({ status }) {
  if (status === "running") {
    return <div className="w-5 h-5 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />;
  }
  const base = "w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold";
  if (status === "done") return <div className={`${base} bg-[#6366F1] text-white`}>✓</div>;
  if (status === "failed") return <div className={`${base} text-white`} style={{ backgroundColor: STATUS_COLOR.critical }}>✕</div>;
  if (status === "skipped") return <div className={`${base} bg-[#E2E8F0] text-[#64748B]`}>–</div>;
  return <div className={`${base} border-2 border-[#CBD5E1] bg-white`} />;
}

// 논문 준비: 논문별 다운로드 성공 여부
function DownloadDetail({ data }) {
  const papers = data.papers ?? [];
  return (
    <ul className="flex flex-col gap-1">
      {papers.map((p) => (
        <li key={p.title} className="flex items-center gap-1.5 text-[11px] text-[#475569]">
          <span style={{ color: p.ok === false ? STATUS_COLOR.critical : STATUS_COLOR.good }}>
            {p.ok === false ? "✕" : p.ok ? "✓" : "·"}
          </span>
          <span className="truncate" title={p.title}>{p.title}</span>
          {p.ok === false && <span className="text-[#94A3B8] whitespace-nowrap">(원문 없음 · 제외)</span>}
        </li>
      ))}
    </ul>
  );
}

// CoT1: 논문별 세부 목표 달성 상태 — 100% 누적 막대 (조각 사이 2px 간격)
function SubgoalDetail({ data }) {
  const papers = (data.papers ?? []).filter((p) => p.subgoals);
  if (!papers.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {papers.map((p) => {
        const total = SUBGOAL_SEGMENTS.reduce((sum, seg) => sum + (p.subgoals[seg.key] ?? 0), 0);
        return (
          <div key={p.title}>
            <div className="flex items-center justify-between text-[11px] text-[#475569] mb-1">
              <span className="truncate" title={p.title}>
                <span className="font-semibold text-[#1E293B]">{p.ref}</span> {p.title}
              </span>
              <span className="text-[#94A3B8] whitespace-nowrap ml-2">목표 {total}개</span>
            </div>
            <div className="flex h-2.5 gap-[2px]">
              {SUBGOAL_SEGMENTS.map((seg) => {
                const count = p.subgoals[seg.key] ?? 0;
                if (!count) return null;
                return (
                  <div
                    key={seg.key}
                    title={`${seg.label} ${count}개`}
                    className="first:rounded-l last:rounded-r"
                    style={{ flex: count, backgroundColor: seg.color }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex gap-3 text-[10px] text-[#64748B]">
        {SUBGOAL_SEGMENTS.map((seg) => (
          <span key={seg.key} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: seg.color }} />
            {seg.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// CoT2: 논문별 한계 후보 — 원문 추출 수 → 검증 통과 수
function LimitationDetail({ data }) {
  const papers = (data.papers ?? []).filter((p) => p.limitations_raw != null);
  return (
    <ul className="flex flex-col gap-1">
      {papers.map((p) => (
        <li key={p.title} className="flex items-center gap-2 text-[11px] text-[#475569]">
          <span className="font-semibold text-[#1E293B]">{p.ref}</span>
          <span>추출 {p.limitations_raw}개</span>
          <span className="text-[#94A3B8]">→</span>
          <span className="font-semibold text-[#1E293B]">검증 통과 {p.limitations}개</span>
        </li>
      ))}
    </ul>
  );
}

// CoT3: 후보 깔때기 — 단계를 지날 때마다 남은 후보 수 (단일 색 가로 막대, 값은 막대 끝)
function FunnelDetail({ data }) {
  const funnel = data.funnel ?? [];
  if (!funnel.length) return <p className="text-[11px] text-[#94A3B8]">후보를 생성하는 중…</p>;
  const max = Math.max(...funnel.map((f) => f.count), 1);
  return (
    <div className="flex flex-col gap-1.5">
      {funnel.map((f) => (
        <div key={f.label} className="flex items-center gap-2" title={`${f.label}: ${f.count}개`}>
          <span className="w-24 shrink-0 text-[11px] text-[#475569]">{f.label}</span>
          <div className="flex-1 flex items-center gap-1.5">
            <div
              className="h-2.5 rounded-r"
              style={{ width: `${Math.max((f.count / max) * 100, 4)}%`, backgroundColor: "#6366F1" }}
            />
            <span className="text-[11px] font-semibold text-[#1E293B]">{f.count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Future Work: 생성된 제안 5개 미리보기
function ProposalDetail({ data }) {
  const proposals = data.proposals ?? [];
  return (
    <ol className="flex flex-col gap-1">
      {proposals.map((p, i) => (
        <li key={p.id ?? i} className="text-[11px] text-[#475569] leading-snug">
          <span className="font-semibold text-[#1E293B]">{i + 1}.</span> {firstSentence(p.direction)}
        </li>
      ))}
    </ol>
  );
}

// CoT4: 제안별 판정 배지 + 우려 항목 4개 (라벨 + 표시 점)
function FeasibilityDetail({ data }) {
  const results = data.results ?? [];
  return (
    <ul className="flex flex-col gap-2">
      {results.map((r, i) => (
        <li key={i} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#1E293B]">제안 {i + 1}</span>
            <VerdictBadge value={r.classification} />
            {r.confidence != null && (
              <span className="text-[10px] text-[#94A3B8]">확신도 {Math.round(r.confidence * 100)}%</span>
            )}
          </div>
          {r.concerns && Object.keys(r.concerns).length > 0 && (
            <div className="flex gap-2 pl-1">
              {Object.entries(CONCERN_LABELS).map(([key, label]) => {
                const present = r.concerns[key];
                return (
                  <span
                    key={key}
                    className="flex items-center gap-1 text-[10px] text-[#64748B]"
                    title={present ? `${label} 우려 있음` : `${label} 우려 없음`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: present ? STATUS_COLOR.serious : "#CBD5E1" }}
                    />
                    {label}
                  </span>
                );
              })}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

// CoT5: 제안별 신규성 판정, 건너뛴 경우 사유
function NoveltyDetail({ stage }) {
  if (stage.status === "skipped") {
    return <p className="text-[11px] text-[#64748B]">{stage.data.reason ?? "건너뜀"}</p>;
  }
  const results = stage.data.results ?? [];
  if (!results.length && stage.status === "running") {
    return <p className="text-[11px] text-[#94A3B8]">CoT4를 통과한 제안 {stage.data.ideas?.length ?? 0}개를 문헌과 비교하는 중…</p>;
  }
  return (
    <ul className="flex flex-col gap-1.5">
      {results.map((r, i) => (
        <li key={i} className="flex items-center gap-2 text-[11px] text-[#475569]">
          <VerdictBadge value={r.classification} />
          <span className="truncate" title={r.title}>{r.title}</span>
        </li>
      ))}
    </ul>
  );
}

function StageDetail({ stage }) {
  const { data } = stage;
  if (!data) return null;
  switch (stage.stage) {
    case "download":
      return <DownloadDetail data={data} />;
    case "CoT1":
      return stage.status === "done" ? <SubgoalDetail data={data} /> : null;
    case "CoT2":
      return <LimitationDetail data={data} />;
    case "CoT3":
      return <FunnelDetail data={data} />;
    case "FutureWork":
      return stage.status === "done" ? <ProposalDetail data={data} /> : null;
    case "CoT4":
      return stage.status === "done" ? <FeasibilityDetail data={data} /> : null;
    case "CoT5":
      return <NoveltyDetail stage={stage} />;
    default:
      return null;
  }
}

const JOB_MESSAGE = {
  queued: "다른 분석이 끝나기를 기다리는 중입니다",
  running: "분석 중",
  completed: "분석 완료",
  no_candidates: "검증을 통과한 연구 공백 후보가 없어 분석을 마쳤습니다",
  failed: "분석 중 오류가 발생했습니다",
  timeout: "분석 시간이 초과되었습니다",
};

function AnalysisProgressPanel({ job }) {
  // 진행 중인 단계의 경과 시간을 1초마다 갱신
  const [now, setNow] = useState(() => Date.now() / 1000);
  const active = job?.status === "running" || job?.status === "queued";
  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(timer);
  }, [active]);

  if (!job) return null;
  const stages = job.stages ?? [];
  const doneCount = stages.filter((s) => s.status === "done" || s.status === "skipped").length;
  const totalElapsed = job.started_at ? (job.finished_at ?? now) - job.started_at : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#64748B]">
          {JOB_MESSAGE[job.status] ?? job.status}
          {totalElapsed != null && ` · ${formatDuration(totalElapsed) || "0초"}`}
        </p>
        <p className="text-xs font-semibold text-[#1E293B]">
          {doneCount}/{stages.length} 단계
        </p>
      </div>
      <ol className="flex flex-col">
        {stages.map((stage, i) => {
          const info = STAGE_INFO[stage.stage] ?? { label: stage.stage, desc: "" };
          const end = stage.finished_at ?? (stage.status === "running" ? now : null);
          const elapsed = stage.started_at && end ? end - stage.started_at : null;
          const isLast = i === stages.length - 1;
          const muted = stage.status === "pending";
          return (
            <li key={stage.stage} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StageIcon status={stage.status} />
                {!isLast && <div className="w-px flex-1 bg-[#E2E8F0] my-1" />}
              </div>
              <div className={`flex-1 min-w-0 ${isLast ? "" : "pb-4"}`}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className={`text-xs font-semibold ${muted ? "text-[#94A3B8]" : "text-[#1E293B]"}`}>
                    {info.label}
                  </p>
                  <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                    {stage.status === "failed" ? "실패" : formatDuration(elapsed)}
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mb-1.5">{info.desc}</p>
                {!muted && <StageDetail stage={stage} />}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default AnalysisProgressPanel;

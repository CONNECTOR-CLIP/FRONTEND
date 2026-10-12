import { CONCERN_LABELS, STATUS_COLOR, VerdictBadge } from "@/components/verdict";

// 제안 상세 모달의 "근거" 탭 — CoT4(실현가능성)·CoT5(신규성)가 왜 그렇게 판정했는지 보여준다.

// 판정의 의미 — QUESTIONABLE은 "불가능"이 아니라 "판단할 근거가 부족함"이라는 점을 분명히 한다.
const FEASIBILITY_MEANING = {
  FEASIBLE: "요구사항이 구체적이고, 주어진 제약 안에서 구현할 수 있다고 판단했어요.",
  QUESTIONABLE: "실현 가능한지 판단할 근거가 부족해요. 불가능하다는 뜻은 아니며, 아래 우려 항목과 누락된 제약을 채우면 다시 판단할 수 있어요.",
  INFEASIBLE: "요구사항이 제약을 넘거나, 제안한 방법으로는 목표를 이루기 어렵다고 판단했어요.",
  ERROR: "실현가능성 검사 중 오류가 발생했어요.",
};

const REQUIREMENT_FIELDS = [
  { key: "compute_requirements", label: "연산·인프라" },
  { key: "data_requirements", label: "데이터" },
  { key: "implementation_steps", label: "구현 단계" },
  { key: "external_dependencies", label: "외부 도구·의존성" },
  { key: "vague_or_unspecified_steps", label: "구체화가 필요한 단계", highlight: true },
];

const OVERLAP_FIELDS = [
  { key: "purpose_overlap", label: "연구 목적" },
  { key: "mechanism_overlap", label: "기술적 방법" },
  { key: "evaluation_overlap", label: "평가 방법" },
  { key: "application_overlap", label: "적용 분야" },
  { key: "evidence_from_abstract", label: "초록 근거" },
];

function Section({ title, children, aside }) {
  return (
    <section className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[#6366F1]">{title}</p>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }) {
  return <p className="text-xs text-[#94A3B8] leading-relaxed">{children}</p>;
}

function Confidence({ value }) {
  if (value == null) return null;
  return <span className="text-[11px] text-[#94A3B8]">확신도 {Math.round(value * 100)}%</span>;
}

export function FeasibilityEvidence({ feasibility }) {
  if (!feasibility) return <Empty>실현가능성(CoT4) 판정 결과가 없어요.</Empty>;
  const { classification, confidence, rationale, concerns = {}, missing_constraints: missing = [], requirements = {}, warnings = [], error } = feasibility;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <VerdictBadge value={classification} />
          <Confidence value={confidence} />
        </div>
        <p className="text-xs text-[#475569] leading-relaxed">{FEASIBILITY_MEANING[classification] ?? ""}</p>
      </div>

      <Section title="판정 근거">
        <p className="text-xs text-[#475569] leading-relaxed">{rationale || error || "근거가 기록되지 않았어요."}</p>
      </Section>

      {Object.keys(concerns).length > 0 && (
        <Section title="우려 항목">
          <ul className="flex flex-col gap-2">
            {Object.entries(CONCERN_LABELS).map(([key, label]) => {
              const concern = concerns[key];
              if (!concern) return null;
              return (
                <li key={key} className="flex gap-2">
                  <span className="self-start flex items-center gap-1 w-16 shrink-0 text-[11px] font-semibold text-[#334155]">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={concern.present ? { backgroundColor: STATUS_COLOR.serious } : { border: "1.5px solid #CBD5E1" }}
                    />
                    {label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#64748B]">{concern.present ? "우려 있음" : "우려 없음"}</p>
                    {concern.explanation && <p className="text-xs text-[#475569] leading-relaxed">{concern.explanation}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {missing.length > 0 && (
        <Section title="누락된 제약 조건" aside={<span className="text-[10px] text-[#94A3B8]">{missing.length}개</span>}>
          <ul className="flex flex-col gap-1 list-disc pl-4">
            {missing.map((m, i) => (
              <li key={i} className="text-xs text-[#475569] leading-relaxed">{m}</li>
            ))}
          </ul>
        </Section>
      )}

      {Object.keys(requirements).length > 0 && (
        <Section title="구현에 필요한 것">
          <div className="flex flex-col gap-2.5">
            {REQUIREMENT_FIELDS.map(({ key, label, highlight }) => {
              const value = requirements[key];
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              return (
                <div
                  key={key}
                  className={highlight ? "rounded-lg border px-3 py-2" : ""}
                  style={highlight ? { borderColor: STATUS_COLOR.warning, backgroundColor: "#FFFBEB" } : undefined}
                >
                  <p className="text-[11px] font-semibold text-[#334155] mb-0.5">
                    {highlight && <span className="mr-1">?</span>}
                    {label}
                  </p>
                  {Array.isArray(value) ? (
                    <ul className="flex flex-col gap-0.5 list-disc pl-4">
                      {value.map((v, i) => (
                        <li key={i} className="text-xs text-[#475569] leading-relaxed">{v}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#475569] leading-relaxed">{value}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {warnings.length > 0 && (
        <Section title="주의">
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-[#475569] leading-relaxed">{w}</p>
          ))}
        </Section>
      )}
    </div>
  );
}

export function NoveltyEvidence({ novelty, missingReason }) {
  if (!novelty) {
    const message =
      missingReason === "CoT4 미통과"
        ? "실현가능성(CoT4) 검사를 통과하지 못해 신규성 검사를 하지 않았어요."
        : missingReason === "건너뜀"
          ? "이번 분석에서는 신규성 검사를 건너뛰었어요."
          : "신규성(CoT5) 판정 결과가 없어요.";
    return <Empty>{message}</Empty>;
  }
  const { classification, reason, review, evaluated_paper_count: evaluated, equivalence_results: papers = [], warnings = [], error } = novelty;
  const equivalentCount = papers.filter((p) => p.equivalent).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <VerdictBadge value={classification} />
          {evaluated != null && <span className="text-[11px] text-[#94A3B8]">로컬 문헌 {evaluated}편과 비교</span>}
        </div>
        <p className="text-xs text-[#475569] leading-relaxed">{reason || error}</p>
      </div>

      {review && (
        <Section title="종합 검토">
          <p className="text-xs text-[#475569] leading-relaxed whitespace-pre-line">{review}</p>
        </Section>
      )}

      {papers.length > 0 && (
        <Section
          title="비교한 논문"
          aside={
            <span className="text-[10px] text-[#94A3B8]">
              동등한 연구 <span className="font-semibold text-[#1E293B]">{equivalentCount}</span> / {papers.length}편
            </span>
          }
        >
          <ul className="flex flex-col gap-2">
            {papers.map((p, i) => (
              <li key={p.paper_id ?? i} className="rounded-lg border border-[#E2E8F0] px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[#1E293B] leading-snug">{p.paper_title || "제목 없음"}</p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <VerdictBadge value={p.equivalent ? "EQUIVALENT" : "DIFFERENT"} />
                    <Confidence value={p.confidence} />
                  </div>
                </div>
                {p.critical_difference && (
                  <p className="mt-1 text-xs text-[#475569] leading-relaxed">
                    <span className="font-semibold text-[#334155]">결정적 차이 </span>
                    {p.critical_difference}
                  </p>
                )}
                <details className="mt-1.5 group">
                  <summary className="cursor-pointer text-[11px] font-medium text-[#6366F1] select-none">항목별 비교 보기</summary>
                  <dl className="mt-1.5 flex flex-col gap-1.5">
                    {OVERLAP_FIELDS.map(({ key, label }) =>
                      p[key] ? (
                        <div key={key}>
                          <dt className="text-[11px] font-semibold text-[#334155]">{label}</dt>
                          <dd className="text-xs text-[#475569] leading-relaxed">{p[key]}</dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                </details>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {warnings.length > 0 && (
        <Section title="주의">
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-[#475569] leading-relaxed">{w}</p>
          ))}
        </Section>
      )}
    </div>
  );
}

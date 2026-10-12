import { CONCERN_LABELS, STATUS_COLOR, VERDICT_STYLE, VerdictBadge } from "@/components/verdict";

// 갭 분석 결과의 제안별 평가(CoT4 실현가능성 · CoT5 신규성)를 한눈에 보여주는 컴포넌트들.
// item.feasibility = CoT4 결과, item.novelty = CoT5 결과, item.noveltyMissingReason = CoT5 판정이 없는 사유

export function hasEvaluation(items) {
  return items.some((item) => item.feasibility || item.novelty || item.noveltyMissingReason);
}

// 결과 목록 카드에 붙는 판정 배지 두 개
export function EvaluationBadges({ item }) {
  if (!item.feasibility && !item.novelty && !item.noveltyMissingReason) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
      <span className="text-[10px] text-[#94A3B8]">실현가능성</span>
      <VerdictBadge value={item.feasibility?.classification} fallbackLabel="판정 없음" />
      <span className="text-[10px] text-[#94A3B8] ml-1">신규성</span>
      <VerdictBadge value={item.novelty?.classification} fallbackLabel={item.noveltyMissingReason ?? "판정 없음"} />
    </div>
  );
}

// 판정별 개수 요약 — "실현 가능 0 · 판단 보류 5 · 실현 불가 0"
function countBy(items, pick, order) {
  const counts = Object.fromEntries(order.map((key) => [key, 0]));
  items.forEach((item) => {
    const key = pick(item);
    if (key in counts) counts[key] += 1;
  });
  return order.map((key) => ({ key, count: counts[key] }));
}

function SummaryRow({ label, entries }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="w-16 shrink-0 text-[11px] font-semibold text-[#475569]">{label}</span>
      {entries.map(({ key, count }) => (
        <span key={key} className="flex items-center gap-1 text-[11px] text-[#64748B]">
          <span
            className="w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
            style={{ backgroundColor: VERDICT_STYLE[key].color }}
          >
            {VERDICT_STYLE[key].icon}
          </span>
          {VERDICT_STYLE[key].label}
          <span className="font-semibold text-[#1E293B]">{count}</span>
        </span>
      ))}
    </div>
  );
}

// 우려 항목 칸: 있음 = 채운 점 + "우려", 없음 = 빈 원 + "없음" (모양과 글자로도 구분)
function ConcernCell({ concern }) {
  if (!concern) return <span className="text-[11px] text-[#CBD5E1]">-</span>;
  const present = Boolean(concern.present);
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] text-[#475569]"
      title={concern.explanation || (present ? "우려 있음" : "우려 없음")}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={
          present
            ? { backgroundColor: STATUS_COLOR.serious }
            : { border: "1.5px solid #CBD5E1" }
        }
      />
      {present ? "우려" : "없음"}
    </span>
  );
}

// 제안 × 판정 비교표. 행을 누르면 해당 제안 상세를 연다.
export function ProposalComparisonTable({ items, onSelect }) {
  const feasibilitySummary = countBy(
    items,
    (item) => item.feasibility?.classification,
    ["FEASIBLE", "QUESTIONABLE", "INFEASIBLE"],
  );
  const noveltySummary = countBy(
    items,
    (item) => item.novelty?.classification,
    ["NOVEL", "UNCERTAIN", "NOT_NOVEL"],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-2.5">
        <SummaryRow label="실현가능성" entries={feasibilitySummary} />
        <SummaryRow label="신규성" entries={noveltySummary} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[10px] font-semibold text-[#64748B]">
              <th className="py-2 pr-2 font-semibold">제안</th>
              <th className="py-2 pr-2 font-semibold">실현가능성</th>
              {Object.values(CONCERN_LABELS).map((label) => (
                <th key={label} className="py-2 pr-2 font-semibold whitespace-nowrap">{label}</th>
              ))}
              <th className="py-2 pr-2 font-semibold">신규성</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const concerns = item.feasibility?.concerns ?? {};
              const confidence = item.feasibility?.confidence;
              return (
                <tr
                  key={i}
                  onClick={() => onSelect(i)}
                  className="border-b border-[#F1F5F9] cursor-pointer hover:bg-[#FAFAFF]"
                  title={item.title}
                >
                  <td className="py-2 pr-2 text-[11px] font-semibold text-[#1E293B] whitespace-nowrap">제안 {i + 1}</td>
                  <td className="py-2 pr-2">
                    <div className="flex flex-col items-start gap-0.5">
                      <VerdictBadge value={item.feasibility?.classification} fallbackLabel="판정 없음" />
                      {confidence != null && (
                        <span className="text-[10px] text-[#94A3B8]">확신도 {Math.round(confidence * 100)}%</span>
                      )}
                    </div>
                  </td>
                  {Object.keys(CONCERN_LABELS).map((key) => (
                    <td key={key} className="py-2 pr-2">
                      <ConcernCell concern={concerns[key]} />
                    </td>
                  ))}
                  <td className="py-2 pr-2">
                    <div className="flex flex-col items-start gap-0.5">
                      <VerdictBadge
                        value={item.novelty?.classification}
                        fallbackLabel={item.noveltyMissingReason ?? "판정 없음"}
                      />
                      {item.novelty?.evaluated_paper_count != null && (
                        <span className="text-[10px] text-[#94A3B8]">논문 {item.novelty.evaluated_paper_count}편과 비교</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-[#94A3B8]">우려 항목에 마우스를 올리면 CoT4의 판단 근거가 보여요. 행을 누르면 제안 상세가 열립니다.</p>
    </div>
  );
}

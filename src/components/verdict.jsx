// CoT4(실현가능성)·CoT5(신규성) 판정 표시용 공통 상수와 배지.
// 상태 색상은 의미(양호/주의/심각) 전용이며, 항상 아이콘·라벨과 함께 쓴다 — 색만으로 의미를 전달하지 않는다.

export const STATUS_COLOR = {
  good: "#0ca30c",
  warning: "#fab219",
  serious: "#ec835a",
  critical: "#d03b3b",
};

export const VERDICT_STYLE = {
  FEASIBLE: { label: "실현 가능", icon: "✓", color: STATUS_COLOR.good },
  QUESTIONABLE: { label: "판단 보류", icon: "?", color: STATUS_COLOR.warning },
  INFEASIBLE: { label: "실현 불가", icon: "✕", color: STATUS_COLOR.critical },
  NOVEL: { label: "신규", icon: "✓", color: STATUS_COLOR.good },
  UNCERTAIN: { label: "불확실", icon: "?", color: STATUS_COLOR.warning },
  NOT_NOVEL: { label: "기존 연구 있음", icon: "✕", color: STATUS_COLOR.critical },
  ERROR: { label: "오류", icon: "!", color: STATUS_COLOR.serious },
  // CoT5 논문별 동등성 검사 (제안 vs 검색된 논문 한 편)
  DIFFERENT: { label: "다름", icon: "✓", color: STATUS_COLOR.good },
  EQUIVALENT: { label: "동등", icon: "✕", color: STATUS_COLOR.critical },
};

export const CONCERN_LABELS = {
  resource: "자원",
  data: "데이터",
  implementation: "구현",
  methodological: "방법론",
};

// 판정이 없을 때(검사 전 단계에서 걸러짐·건너뜀)는 회색 배지에 사유를 적는다.
export function VerdictBadge({ value, fallbackLabel }) {
  const style = VERDICT_STYLE[value] ?? { label: fallbackLabel ?? value ?? "-", icon: "–", color: "#94A3B8" };
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-2 py-0.5 text-[11px] font-medium text-[#334155] whitespace-nowrap">
      <span
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
        style={{ backgroundColor: style.color }}
      >
        {style.icon}
      </span>
      {style.label}
    </span>
  );
}

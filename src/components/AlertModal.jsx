import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "@/store/useNotificationStore";

// ISO 날짜를 "방금 전 / N분 전 / N시간 전 / N일 전" 형태로 변환
function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

// 상단 벨을 누르면 열리는 알림 목록 — 갭 분석 완료·실패 알림을 보여준다.
// 알림을 누르면 해당 검색어의 로드맵으로 이동해 결과(또는 멈춘 단계)를 이어서 본다.
function AlertModal({ onClose }) {
  const navigate = useNavigate();
  const notifications = useNotificationStore((s) => s.notifications);
  const remove = useNotificationStore((s) => s.remove);
  const clear = useNotificationStore((s) => s.clear);
  const panelRef = useRef(null);

  // 열면 모두 읽음 처리, 바깥을 누르거나 Esc를 누르면 닫힘
  useEffect(() => {
    useNotificationStore.getState().markAllRead();
    // 벨 버튼(같은 감싸는 요소 안)을 누른 경우는 버튼이 직접 열고 닫는다
    const handleClick = (e) => {
      if (!panelRef.current?.parentElement?.contains(e.target)) onClose();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const openResult = (n) => {
    onClose();
    navigate("/roadmap", { state: { query: n.query } });
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-3 w-[340px] rounded-2xl border border-[#E2E8F0] bg-white shadow-lg z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
        <span className="text-sm font-semibold text-[#1E293B]">알림</span>
        {notifications.length > 0 && (
          <button
            onClick={clear}
            className="text-xs text-[#64748B] hover:text-[#1E293B] transition-colors"
          >
            모두 지우기
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-[#64748B]">
          새 알림이 없어요.
          <br />
          <span className="text-xs">갭 분석이 끝나면 여기에서 알려드려요.</span>
        </p>
      ) : (
        <ul className="max-h-[360px] overflow-y-auto py-1">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="group flex items-start gap-3 px-4 py-3 hover:bg-[#F8FAFC]"
            >
              <span
                className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                  ${n.succeeded ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEE2E2] text-[#B91C1C]"}`}
              >
                {n.succeeded ? "✓" : "!"}
              </span>
              <button
                onClick={() => openResult(n)}
                className="flex-1 min-w-0 text-left"
              >
                <p className="text-sm font-medium text-[#1E293B]">
                  {n.succeeded ? "갭 분석이 끝났어요" : "갭 분석이 멈췄어요"}
                </p>
                <p className="text-xs text-[#64748B] mt-0.5 truncate">
                  {n.query ? `'${n.query}'` : "검색어 없음"}
                  {n.paperCount ? ` · 논문 ${n.paperCount}편` : ""}
                  {` · ${timeAgo(n.createdAt)}`}
                </p>
                <p className="text-xs text-[#4F46E5] mt-1">
                  {n.succeeded ? "결과 보러 가기 →" : "멈춘 단계 확인하기 →"}
                </p>
              </button>
              <button
                onClick={() => remove(n.id)}
                aria-label="알림 삭제"
                className="opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-[#475569] transition-opacity text-sm leading-none"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlertModal;

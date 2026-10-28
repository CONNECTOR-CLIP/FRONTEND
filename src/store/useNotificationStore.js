import { create } from "zustand";

// 상단 알림(벨) 목록 — 갭 분석 완료·실패 알림을 브라우저에 보관한다 (최대 20개)
const STORAGE_KEY = "clip.notifications";
const MAX_ITEMS = 20;

function loadNotifications() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveNotifications(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

const useNotificationStore = create((set, get) => ({
  notifications: loadNotifications(),
  // 로드맵 화면이 직접 폴링 중인 작업 ID — 상단 감시자가 같은 작업을 중복 조회하지 않도록 한다
  activeJobId: null,

  setActiveJobId: (activeJobId) => set({ activeJobId }),

  // 같은 id(작업 ID)는 한 번만 추가한다. 새로 추가했으면 true
  add: (item) => {
    if (get().notifications.some((n) => n.id === item.id)) return false;
    const next = [item, ...get().notifications].slice(0, MAX_ITEMS);
    saveNotifications(next);
    set({ notifications: next });
    return true;
  },

  markAllRead: () => {
    const next = get().notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(next);
    set({ notifications: next });
  },

  remove: (id) => {
    const next = get().notifications.filter((n) => n.id !== id);
    saveNotifications(next);
    set({ notifications: next });
  },

  clear: () => {
    saveNotifications([]);
    set({ notifications: [] });
  },
}));

// 알림 권한은 사용자가 분석을 시작할 때(클릭 직후) 한 번만 요청한다.
export function requestAnalysisNotification() {
  try {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  } catch {}
}

// 분석이 끝나면 상단 벨 목록에 남기고, 사용자가 이 창을 보고 있지 않으면 탭 제목과 브라우저 알림으로도 알린다.
// 로드맵 화면과 상단 감시자 양쪽에서 불릴 수 있어 작업 ID로 한 번만 처리한다.
// kind: "analysis"(기본 분석) | "verify"(고른 아이디어 심화 검증)
export function notifyAnalysisFinished({
  jobId,
  kind = "analysis",
  succeeded,
  query,
  paperCount,
  ideaCount,
}) {
  const watching = !document.hidden && document.hasFocus();
  const added = useNotificationStore.getState().add({
    id: jobId,
    kind,
    succeeded,
    query: query ?? "",
    paperCount: paperCount ?? null,
    ideaCount: ideaCount ?? null,
    createdAt: new Date().toISOString(),
    // 로드맵 화면을 보고 있으면 결과를 이미 본 것이므로 읽음 처리
    read: watching && window.location.pathname === "/roadmap",
  });
  if (!added || watching) return;

  const verify = kind === "verify";
  const label = verify
    ? succeeded
      ? "✓ 검증 완료"
      : "검증 실패"
    : succeeded
      ? "✓ 분석 완료"
      : "분석 실패";
  const originalTitle = document.title;
  document.title = `${label} · ${originalTitle}`;
  const restoreTitle = () => {
    if (document.hidden) return;
    document.title = originalTitle;
    document.removeEventListener("visibilitychange", restoreTitle);
    window.removeEventListener("focus", restoreTitle);
  };
  document.addEventListener("visibilitychange", restoreTitle);
  window.addEventListener("focus", restoreTitle);
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`CLIP ${label}`, {
        body: verify
          ? succeeded
            ? "고른 아이디어의 실현가능성·신규성 판정을 확인해 보세요."
            : "검증 과정에서 어느 단계가 멈췄는지 확인해 보세요."
          : succeeded
            ? "추천 아이디어를 확인해 보세요. 원하는 아이디어는 골라서 심화 검증할 수 있어요."
            : "분석 과정에서 어느 단계가 멈췄는지 확인해 보세요.",
      });
    }
  } catch {}
}

export default useNotificationStore;

import { create } from "zustand";

// 전역 인증 상태 관리 스토어
const useAuthStore = create((set) => ({
  user: null,
  // 앱 초기 로드 시 토큰이 있으면 로그인 상태로 간주
  isAuthenticated: !!localStorage.getItem("token"),

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  // 로그인 성공 후 호출 — 토큰은 localStorage에, 유저 정보는 스토어에 저장
  setAuth: ({ user, token }) => {
    if (token) localStorage.setItem("token", token);
    // user가 없어도 token만 있으면 인증 상태로 처리
    set({ user: user ?? null, isAuthenticated: !!(user || token) });
  },

  // 로그아웃 시 토큰 제거 및 상태 초기화
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;

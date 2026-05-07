import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuth: ({ user, token }) => {
    if (token) localStorage.setItem("token", token);
    set({ user: user ?? null, isAuthenticated: !!(user || token) });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;

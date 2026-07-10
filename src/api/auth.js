import api, { unwrap } from "./client";

// 인증 관련 API 모음 — 회원가입, 로그인, 소셜 로그인, 아이디/비밀번호 찾기
export const authApi = {
  signup: (payload) => unwrap(api.post("/api/auth/signup", payload)),
  login: (payload) => unwrap(api.post("/api/auth/login", payload)),
  // 구글/네이버/카카오 등 소셜 로그인 처리
  socialLogin: (payload) => unwrap(api.post("/api/auth/social/login", payload)),
  logout: () => unwrap(api.post("/api/auth/logout")),
  findId: (payload) => unwrap(api.post("/api/auth/findId", payload)),
  findPassword: (payload) => unwrap(api.post("/api/auth/findpassword", payload)),
};

export const signup = authApi.signup;
export const login = authApi.login;
export const socialLogin = authApi.socialLogin;
export const logout = authApi.logout;
export const findId = authApi.findId;
export const findPassword = authApi.findPassword;

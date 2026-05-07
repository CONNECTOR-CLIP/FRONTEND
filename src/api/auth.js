import api, { unwrap } from "./client";

export const authApi = {
  signup: (payload) => unwrap(api.post("/api/auth/signup", payload)),
  login: (payload) => unwrap(api.post("/api/auth/login", payload)),
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

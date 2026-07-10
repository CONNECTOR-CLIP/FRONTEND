import api, { unwrap } from "./client";

// 유저 정보 조회 및 계정 관리 API
export const usersApi = {
  // 로그인한 유저의 프로필 정보 조회
  getInformation: () => unwrap(api.get("/api/users/information")),
  updateNickname: (payload) => unwrap(api.patch("/api/users/nickname", payload)),
  // 비밀번호 변경은 DELETE에 body를 담는 방식 (서버 설계 특이사항)
  changePassword: (payload) =>
    unwrap(api.delete("/api/users/password", { data: payload })),
  deleteAccount: () => unwrap(api.delete("/api/users/account")),
};

export const getUserInformation = usersApi.getInformation;
export const updateNickname = usersApi.updateNickname;
export const changePassword = usersApi.changePassword;

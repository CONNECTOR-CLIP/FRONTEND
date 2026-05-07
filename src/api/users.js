import api, { unwrap } from "./client";

export const usersApi = {
  getInformation: () => unwrap(api.get("/api/users/information")),
  updateNickname: (payload) => unwrap(api.patch("/api/users/nickname", payload)),
  changePassword: (payload) =>
    unwrap(api.delete("/api/users/password", { data: payload })),
};

export const getUserInformation = usersApi.getInformation;
export const updateNickname = usersApi.updateNickname;
export const changePassword = usersApi.changePassword;

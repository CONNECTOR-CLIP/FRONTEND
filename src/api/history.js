import api, { unwrap } from "./client";

export const historyApi = {
  saveHistory: (payload) => unwrap(api.post("/api/history", payload)),
  getHistory: (params) => unwrap(api.get("/api/history", { params })),
};

export const saveHistory = historyApi.saveHistory;
export const getHistory = historyApi.getHistory;

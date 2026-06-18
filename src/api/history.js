import api, { unwrap } from "./client";

export const historyApi = {
  saveHistory: (payload) => unwrap(api.post("/api/history", payload)),
  getHistory: (params) => unwrap(api.get("/api/history", { params })),
  deleteHistory: (id) => unwrap(api.delete(`/api/history/${id}`)),
  clearHistory: () => unwrap(api.delete("/api/history")),
};

export const saveHistory = historyApi.saveHistory;
export const getHistory = historyApi.getHistory;
export const deleteHistory = historyApi.deleteHistory;
export const clearHistory = historyApi.clearHistory;

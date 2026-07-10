import api, { unwrap } from "./client";

// 검색 기록 저장/조회/삭제 API
export const historyApi = {
  saveHistory: (payload) => unwrap(api.post("/api/history", payload)),
  getHistory: (params) => unwrap(api.get("/api/history", { params })),
  // 특정 기록 한 건 삭제
  deleteHistory: (id) => unwrap(api.delete(`/api/history/${id}`)),
  // 전체 기록 초기화
  clearHistory: () => unwrap(api.delete("/api/history")),
};

export const saveHistory = historyApi.saveHistory;
export const getHistory = historyApi.getHistory;
export const deleteHistory = historyApi.deleteHistory;
export const clearHistory = historyApi.clearHistory;

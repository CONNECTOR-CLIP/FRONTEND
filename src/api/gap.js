import api, { unwrap } from "./client";

export const gapApi = {
  getResult: (params) => unwrap(api.get("/api/result", { params })),
  refreshRecommendations: (payload) =>
    unwrap(api.post("/api/gap/refresh", payload, { timeout: 0 })),
  getGapDetail: (id) => unwrap(api.get(`/api/gap/${encodeURIComponent(id)}`)),
  generateDraft: (proposal) =>
    unwrap(api.post("/api/gap/draft", { proposal }, { timeout: 0 })),
};

export const getGapResult = gapApi.getResult;
export const refreshGapRecommendations = gapApi.refreshRecommendations;
export const getGapDetail = gapApi.getGapDetail;

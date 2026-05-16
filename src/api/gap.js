import api, { unwrap } from "./client";

export const gapApi = {
  getResult: (params) => unwrap(api.get("/api/result", { params })),
  refreshRecommendations: (payload) =>
    unwrap(api.post("/api/gap/refresh", payload)),
  getGapDetail: (id) => unwrap(api.get(`/api/gap/${encodeURIComponent(id)}`)),
};

export const getGapResult = gapApi.getResult;
export const refreshGapRecommendations = gapApi.refreshRecommendations;
export const getGapDetail = gapApi.getGapDetail;

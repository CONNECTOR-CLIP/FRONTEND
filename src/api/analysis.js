import api, { unwrap } from "./client";

export const analysisApi = {
  getDistribution: (params) =>
    unwrap(api.get("/api/analysis/distribution", { params })),
  analyzeGap: (payload) => unwrap(api.post("/api/analysis", payload)),
};

export const getAnalysisDistribution = analysisApi.getDistribution;
export const analyzeGap = analysisApi.analyzeGap;

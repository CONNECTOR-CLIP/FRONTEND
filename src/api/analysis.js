import api, { unwrap } from "./client";

export const analysisApi = {
  getDistribution: (payload) =>
    unwrap(api.post("/api/analysis/distribution", payload)),
  analyzeGap: (payload) => unwrap(api.post("/api/gap", payload)),
};

export const getAnalysisDistribution = analysisApi.getDistribution;
export const analyzeGap = analysisApi.analyzeGap;

import api, { unwrap } from "./client";

export const analysisApi = {
  getDistribution: () => unwrap(api.get("/api/analysis/distribution")),
};

export const getAnalysisDistribution = analysisApi.getDistribution;

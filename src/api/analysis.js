import api, { unwrap } from "./client";

// 논문 카테고리 분포 분석 API
export const analysisApi = {
  getDistribution: () => unwrap(api.get("/api/analysis/distribution")),
};

export const getAnalysisDistribution = analysisApi.getDistribution;

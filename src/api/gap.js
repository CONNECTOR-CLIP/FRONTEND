import api, { unwrap } from "./client";

// 연구 갭(미래 연구 방향) 분석 관련 API
export const gapApi = {
  // 검색 결과 로드맵 데이터 조회
  getResult: (params) => unwrap(api.get("/api/result", { params })),
  // AI 갭 추천 재생성 — 시간이 오래 걸리므로 timeout을 0으로 설정해 무제한 대기
  refreshRecommendations: (payload) =>
    unwrap(api.post("/api/gap/refresh", payload, { timeout: 0 })),
  // 특정 갭의 상세 내용 조회 (arxiv id에 특수문자 있으므로 인코딩)
  getGapDetail: (id) => unwrap(api.get(`/api/gap/${encodeURIComponent(id)}`)),
  // 선택한 논문 기반 연구 제안 초안 생성 — AI 호출이라 timeout 무제한
  generateDraft: (proposal) =>
    unwrap(api.post("/api/gap/draft", { proposal }, { timeout: 0 })),
};

export const getGapResult = gapApi.getResult;
export const refreshGapRecommendations = gapApi.refreshRecommendations;
export const getGapDetail = gapApi.getGapDetail;

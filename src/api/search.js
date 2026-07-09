import api, { unwrap } from "./client";

// 논문 검색 및 검색어 관련 API
export const searchApi = {
  // 키워드로 논문 검색 (POST — 검색 파라미터가 많아 body 사용)
  searchPapers: (payload) => unwrap(api.post("/api/search", payload)),
  // 로그인 유저의 최근 검색어 목록 조회
  getRecentSearchWords: () => unwrap(api.get("/api/search/recent")),
  // 서비스 전체 트렌딩 키워드 조회
  getTrendKeywords: () => unwrap(api.get("/api/search/trend")),
};

export const searchPapers = searchApi.searchPapers;
export const getRecentSearchWords = searchApi.getRecentSearchWords;
export const getTrendKeywords = searchApi.getTrendKeywords;

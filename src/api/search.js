import api, { unwrap } from "./client";

export const searchApi = {
  searchPapers: (payload) => unwrap(api.post("/api/search", payload)),
  getRecentSearchWords: () => unwrap(api.get("/api/search/recent")),
  getTrendKeywords: () => unwrap(api.get("/api/search/trend")),
};

export const searchPapers = searchApi.searchPapers;
export const getRecentSearchWords = searchApi.getRecentSearchWords;
export const getTrendKeywords = searchApi.getTrendKeywords;

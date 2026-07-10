import api, { unwrap } from "./client";

// 논문/갭 북마크 CRUD API
export const bookmarksApi = {
  // 논문 북마크 추가
  addPaperBookmark: (payload) => unwrap(api.post("/api/bookmarks/paper", payload)),
  // paper_id를 URL에 그대로 쓰면 슬래시 문제가 생기므로 인코딩 처리
  removePaperBookmark: (id) =>
    unwrap(api.delete(`/api/bookmarks/paper/${encodeURIComponent(id)}`)),
  getBookmarks: (params) => unwrap(api.get("/api/bookmarks", { params })),
  getGapBookmarks: () => unwrap(api.get("/api/bookmarks/gap")),
  addGapBookmark: (payload) => unwrap(api.post("/api/bookmarks/gap", payload)),
  removeGapBookmark: (id) => unwrap(api.delete(`/api/bookmarks/gap/${id}`)),
};

export const addPaperBookmark = bookmarksApi.addPaperBookmark;
export const removePaperBookmark = bookmarksApi.removePaperBookmark;
export const getBookmarks = bookmarksApi.getBookmarks;

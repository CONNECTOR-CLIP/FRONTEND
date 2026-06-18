import api, { unwrap } from "./client";

export const bookmarksApi = {
  addPaperBookmark: (payload) => unwrap(api.post("/api/bookmarks/paper", payload)),
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

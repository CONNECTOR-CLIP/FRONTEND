import api, { unwrap } from "./client";

export const bookmarksApi = {
  addPaperBookmark: (payload) => unwrap(api.post("/api/bookmarks/paper", payload)),
  removePaperBookmark: (id) =>
    unwrap(api.delete(`/api/bookmarks/paper/${encodeURIComponent(id)}`)),
  getBookmarks: (params) => unwrap(api.get("/api/bookmarks", { params })),
};

export const addPaperBookmark = bookmarksApi.addPaperBookmark;
export const removePaperBookmark = bookmarksApi.removePaperBookmark;
export const getBookmarks = bookmarksApi.getBookmarks;

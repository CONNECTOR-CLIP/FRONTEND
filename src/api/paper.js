import api, { unwrap } from "./client";

export const paperApi = {
  getPaperDetail: (id) => unwrap(api.get(`/api/paper/${encodeURIComponent(id)}`)),
  getPaperList: (params) => unwrap(api.get("/api/paper", { params })),
};

export const getPaperDetail = paperApi.getPaperDetail;
export const getPaperList = paperApi.getPaperList;

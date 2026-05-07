import api, { unwrap } from "./client";

export const roadmapApi = {
  getRoadmap: (params) => unwrap(api.get("/api/roadmap", { params })),
  getNodeDetail: (id) =>
    unwrap(api.get(`/api/roadmap/node/${encodeURIComponent(id)}`)),
};

export const getRoadmap = roadmapApi.getRoadmap;
export const getRoadmapNodeDetail = roadmapApi.getNodeDetail;

import api, { unwrap } from "./client";

// 로드맵 및 노드 상세 조회 API
export const roadmapApi = {
  // 키워드 기반 연구 로드맵 트리 조회
  getRoadmap: (params) => unwrap(api.get("/api/roadmap", { params })),
  // 특정 노드의 상세 정보 조회 (node_id에 :: 포함되므로 인코딩)
  getNodeDetail: (id) =>
    unwrap(api.get(`/api/roadmap/node/${encodeURIComponent(id)}`)),
};

export const getRoadmap = roadmapApi.getRoadmap;
export const getRoadmapNodeDetail = roadmapApi.getNodeDetail;

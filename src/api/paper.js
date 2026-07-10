import api, { unwrap } from "./client";

// 논문 조회 및 선택 API
export const paperApi = {
  // arxiv id에 '.' 같은 특수문자가 포함되므로 인코딩 필수
  getPaperDetail: (id) => unwrap(api.get(`/api/paper/${encodeURIComponent(id)}`)),
  getPaperList: (params) => unwrap(api.get("/api/paper", { params })),
  // 갭 분석에 사용할 논문 목록을 서버에 전달
  selectPapers: (papers) => unwrap(api.post("/api/paper/select", { papers })),
};

export const getPaperDetail = paperApi.getPaperDetail;
export const getPaperList = paperApi.getPaperList;
export const selectPapers = paperApi.selectPapers;

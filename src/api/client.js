import axios from "axios";

// axios 인스턴스 생성 — baseURL은 환경변수 우선, 없으면 로컬 서버
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청마다 로컬스토리지의 토큰을 꺼내 Authorization 헤더에 붙임
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

// response.data만 꺼내서 반환하는 헬퍼 — 호출부에서 매번 .data를 쓸 필요 없음
export function unwrap(request) {
  return request.then((response) => response.data);
}

export default api;

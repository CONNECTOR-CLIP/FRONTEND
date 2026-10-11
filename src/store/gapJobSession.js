// 진행 중인 갭 분석 작업 ID — 새로고침·페이지 이동 후 같은 검색어로 돌아오면 이어서 폴링한다.
// sessionStorage가 막힌 환경(사생활 보호 모드 등)에서는 조용히 무시한다.
const GAP_JOB_KEY = "clip.gapJob";

export function saveGapJob(jobId, query, paperIds) {
  try {
    sessionStorage.setItem(
      GAP_JOB_KEY,
      JSON.stringify({ jobId, query: query ?? "", paperIds }),
    );
  } catch {}
}

export function loadSavedGapJob() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(GAP_JOB_KEY) ?? "null");
    return saved?.jobId ? saved : null;
  } catch {
    return null;
  }
}

export function clearSavedGapJob() {
  try {
    sessionStorage.removeItem(GAP_JOB_KEY);
  } catch {}
}

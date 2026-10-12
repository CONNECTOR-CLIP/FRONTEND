import { useEffect } from "react";
import { gapApi } from "@/api";
import useNotificationStore, {
  notifyAnalysisFinished,
} from "@/store/useNotificationStore";
import { loadSavedGapJob, clearSavedGapJob } from "@/store/gapJobSession";

const CHECK_INTERVAL_MS = 5000;

// 로드맵 화면을 떠나 있어도 진행 중인 갭 분석이 끝나면 상단 벨로 알린다.
// 로드맵 화면이 직접 조회 중인 작업은 건너뛰고, 끝난 작업은 저장해 둔 채로 두어
// 알림을 눌러 로드맵으로 돌아가면 결과를 이어서 볼 수 있게 한다.
function GapJobWatcher() {
  useEffect(() => {
    let stopped = false;
    let timer;

    async function check() {
      const saved = loadSavedGapJob();
      const { activeJobId, notifications } = useNotificationStore.getState();
      const pending =
        saved &&
        saved.jobId !== activeJobId &&
        !notifications.some((n) => n.id === saved.jobId);
      if (pending) {
        try {
          const job = await gapApi.getAnalysisJob(saved.jobId);
          if (!stopped && job && !["queued", "running"].includes(job.status)) {
            notifyAnalysisFinished({
              jobId: saved.jobId,
              succeeded: job.status === "completed",
              query: saved.query,
              paperCount: saved.paperIds?.length,
            });
          }
        } catch (error) {
          // 서버 재시작 등으로 작업이 사라졌으면 더 조회하지 않는다
          if (error?.response?.status === 404) clearSavedGapJob();
        }
      }
      if (!stopped) timer = setTimeout(check, CHECK_INTERVAL_MS);
    }

    check();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, []);

  return null;
}

export default GapJobWatcher;

import { Outlet } from "react-router-dom";
import ContentNavbar from "@/components/ContentNavbar";

// 로그인 후 서비스 페이지 레이아웃 — ContentNavbar + 부드러운 배경 orb + 페이지 콘텐츠
function MainLayout() {
  return (
    <div className="min-h-screen min-w-[900px] relative overflow-x-auto">
      {/* 고정 배경 orb — 포인터 이벤트 차단해 클릭 방해하지 않도록 처리 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-10 -left-20 w-[500px] h-[500px] rounded-full bg-[#bfdbfe] opacity-50 blur-[30px]" />
        <div className="absolute top-80 right-0 w-[450px] h-[450px] rounded-full bg-[#ddd6fe] opacity-40 blur-[30px]" />
      </div>

      <ContentNavbar />
      <Outlet />
    </div>
  );
}

export default MainLayout;

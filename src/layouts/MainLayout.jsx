import { Outlet } from "react-router-dom";
import ContentNavbar from "@/components/ContentNavbar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* bg blur orbs */}
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

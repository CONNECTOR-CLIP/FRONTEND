import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "@/components/LoginModal";

// 랜딩/회원가입 등 비로그인 페이지 상단 네비게이션 바
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  const scrollToSection = (sectionId) => {
    if (location.pathname === "/") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/60 backdrop-blur-md">
        <div
          id="navbar"
          className="mx-auto flex h-16 max-w-9xl items-center justify-between px-8"
        >
          <div
            id="logo"
            className="text-xl font-extrabold tracking-tight text-[#1D4ED8]"
          >
            {/* 로고 클릭 시 랜딩 페이지(/)로 이동 */}
            <button
              onClick={() => navigate("/")}
              className="w-[50px] h-[32px] text-[24px] font-extrabold hover:cursor-pointer"
            >
              CLIP
            </button>
          </div>
          <div
            id="nav-contents"
            className="flex items-center gap-8 text-[#64748B]"
          >
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm hover:text-black"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("research")}
              className="text-sm hover:text-black"
            >
              Research
            </button>
            <button
              onClick={() => scrollToSection("Team Blog")}
              className="text-sm hover:text-black"
            >
              Team Blog
            </button>
            <button
              onClick={() => scrollToSection("documentation")}
              className="text-sm hover:text-black"
            >
              Documentation
            </button>
          </div>
          <div id="profile" className="flex items-center gap-6">
            {/* Sign in / Start 버튼 둘 다 로그인 모달 열기 */}
            <button
              onClick={() => navigate("/signup")}
              className="text-[16px] text-[#64748B] hover:text-black"
            >
              Sign in
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center justify-center rounded-full w-[87px] h-[44px] bg-[#0060AD] font-bold text-[16px] text-white hover:bg-gray-800"
            >
              Start
            </button>
          </div>
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Navbar;

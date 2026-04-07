import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ContentNavbar() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showalert, setShowalert] = useState(false);
  const [showsetting, setShowsetting] = useState(false);
  const [showmyprofile, setShowmyprofile] = useState(false);

  return (
    <>
      <nav className="w-full border-b border-gray-200 bg-white/60 backdrop-blur-md">
        <div
          id="navbar"
          className="mx-auto flex h-16 max-w-9xl items-center justify-between px-8"
        >
          <div
            id="logo"
            className="text-xl font-extrabold tracking-tight text-[#1D4ED8]"
          >
            <button
              onClick={() => navigate("/")}
              className="w-[50px] h-[32px] text-[24px] font-extrabold hover:cursor-pointer"
            >
              CLIP
            </button>
          </div>
          <div
            id="nav-contents"
            className="flex items-center gap-[32px] text-[#64748B]"
          >
            <button
              onClick={() => navigate("/Features")}
              className="text-sm hover:text-black"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/Research")}
              className="text-sm hover:text-black"
            >
              검색하기
            </button>
            <button
              onClick={() => navigate("/Documentation")}
              className="text-sm hover:text-black"
            >
              검색기록
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="text-[16px] text-[#64748B] hover:text-black"
            >
              Network
            </button>
          </div>
          <div id="profile" className="flex items-center gap-[24px]">
            <button onClick={() => setShowalert(true)}>alert</button>
            <button onClick={() => setShowsetting(true)}>setting</button>
            <button onClick={() => setShowmyprofile(true)}>myprofile</button>
          </div>
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showalert && <AlertModal onClose={() => setShowalert(false)} />}
      {showsetting && <SettingModal onClose={() => setShowsetting(false)} />}
      {showmyprofile && (
        <MyProfileModal onClose={() => setShowmyprofile(false)} />
      )}
    </>
  );
}

export default ContentNavbar;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal";

function ContentNavbar() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showalert, setShowalert] = useState(false);
  const hasAlert = true; // 알림 존재 여부 (추후 실제 데이터로 교체)
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
            <button onClick={() => setShowalert(true)}>
              {hasAlert ? (
                <svg
                  width="17"
                  height="20"
                  viewBox="0 0 17 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z"
                    fill="#466084"
                  />
                  <rect x="8.01172" width="8" height="8" rx="4" fill="#AC3434" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0V17M8 9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5M8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20V20M4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15V15"
                    fill="#466084"
                  />
                </svg>
              )}
            </button>
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

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AlertModal from "./AlertModal";

function ContentNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
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
              onClick={() => navigate("/home")}
              className="w-[50px] h-[32px] text-[24px] font-extrabold hover:cursor-pointer"
            >
              CLIP
            </button>
          </div>
          <div
            id="nav-contents"
            className="flex items-center gap-8 text-[#64748B]"
          >
            {[
              { label: "Dashboard", path: "/home" },
              { label: "검색하기", path: "/Research" },
              { label: "검색기록", path: "/Documentation" },
            ].map(({ label, path }) => {
              const active = pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`text-sm cursor-pointer border-b-2 pb-0.5 transition-colors ${
                    active
                      ? "text-[#1d4ed8] border-[#1d4ed8]"
                      : "text-[#64748B] border-transparent hover:text-black"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button
              onClick={() => setShowLogin(true)}
              className={`text-sm cursor-pointer border-b-2 pb-0.5 transition-colors border-transparent text-[#64748B] hover:text-black`}
            >
              Network
            </button>
          </div>
          <div id="profile" className="flex items-center gap-[24px]">
            <button
              id="alert"
              className="cursor-pointer hover:svg-hover"
              onClick={() => setShowalert(true)}
            >
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
                  <rect
                    x="8.01172"
                    width="8"
                    height="8"
                    rx="4"
                    fill="#AC3434"
                  />
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
            <button id="setting" onClick={() => setShowsetting(true)}>
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.3 20L6.9 16.8C6.68333 16.7167 6.47917 16.6167 6.2875 16.5C6.09583 16.3833 5.90833 16.2583 5.725 16.125L2.75 17.375L0 12.625L2.575 10.675C2.55833 10.5583 2.55 10.4458 2.55 10.3375C2.55 10.2292 2.55 10.1167 2.55 10C2.55 9.88333 2.55 9.77083 2.55 9.6625C2.55 9.55417 2.55833 9.44167 2.575 9.325L0 7.375L2.75 2.625L5.725 3.875C5.90833 3.74167 6.1 3.61667 6.3 3.5C6.5 3.38333 6.7 3.28333 6.9 3.2L7.3 0H12.8L13.2 3.2C13.4167 3.28333 13.6208 3.38333 13.8125 3.5C14.0042 3.61667 14.1917 3.74167 14.375 3.875L17.35 2.625L20.1 7.375L17.525 9.325C17.5417 9.44167 17.55 9.55417 17.55 9.6625C17.55 9.77083 17.55 9.88333 17.55 10C17.55 10.1167 17.55 10.2292 17.55 10.3375C17.55 10.4458 17.5333 10.5583 17.5 10.675L20.075 12.625L17.325 17.375L14.375 16.125C14.1917 16.2583 14 16.3833 13.8 16.5C13.6 16.6167 13.4 16.7167 13.2 16.8L12.8 20H7.3ZM9.05 18H11.025L11.375 15.35C11.8917 15.2167 12.3708 15.0208 12.8125 14.7625C13.2542 14.5042 13.6583 14.1917 14.025 13.825L16.5 14.85L17.475 13.15L15.325 11.525C15.4083 11.2917 15.4667 11.0458 15.5 10.7875C15.5333 10.5292 15.55 10.2667 15.55 10C15.55 9.73333 15.5333 9.47083 15.5 9.2125C15.4667 8.95417 15.4083 8.70833 15.325 8.475L17.475 6.85L16.5 5.15L14.025 6.2C13.6583 5.81667 13.2542 5.49583 12.8125 5.2375C12.3708 4.97917 11.8917 4.78333 11.375 4.65L11.05 2H9.075L8.725 4.65C8.20833 4.78333 7.72917 4.97917 7.2875 5.2375C6.84583 5.49583 6.44167 5.80833 6.075 6.175L3.6 5.15L2.625 6.85L4.775 8.45C4.69167 8.7 4.63333 8.95 4.6 9.2C4.56667 9.45 4.55 9.71667 4.55 10C4.55 10.2667 4.56667 10.525 4.6 10.775C4.63333 11.025 4.69167 11.275 4.775 11.525L2.625 13.15L3.6 14.85L6.075 13.8C6.44167 14.1833 6.84583 14.5042 7.2875 14.7625C7.72917 15.0208 8.20833 15.2167 8.725 15.35L9.05 18ZM10.1 13.5C11.0667 13.5 11.8917 13.1583 12.575 12.475C13.2583 11.7917 13.6 10.9667 13.6 10C13.6 9.03333 13.2583 8.20833 12.575 7.525C11.8917 6.84167 11.0667 6.5 10.1 6.5C9.11667 6.5 8.2875 6.84167 7.6125 7.525C6.9375 8.20833 6.6 9.03333 6.6 10C6.6 10.9667 6.9375 11.7917 7.6125 12.475C8.2875 13.1583 9.11667 13.5 10.1 13.5Z"
                  fill="#466084"
                />
              </svg>
            </button>
            <button id="profile" onClick={() => setShowmyprofile(true)}>
              마이프로필
            </button>
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "@/components/LoginModal";

function Navbar() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

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
              Features
            </button>
            <button
              onClick={() => navigate("/Research")}
              className="text-sm hover:text-black"
            >
              Research
            </button>
            <button
              onClick={() => navigate("/Pricing")}
              className="text-sm hover:text-black"
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/Documentation")}
              className="text-sm hover:text-black"
            >
              Documentation
            </button>
          </div>
          <div id="profile" className="flex items-center gap-[24px]">
            <button
              onClick={() => setShowLogin(true)}
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

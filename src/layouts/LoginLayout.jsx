import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

// 배경 orb에 쓸 파스텔 색상 팔레트
const PALETTE = [
  "#bfdbfe",
  "#ddd6fe",
  "#fbcfe8",
  "#bbf7d0",
  "#fde68a",
  "#a5f3fc",
  "#fca5a5",
  "#6ee7b7",
  "#c4b5fd",
  "#fdba74",
  "#86efac",
  "#93c5fd",
];

// 팔레트에서 랜덤 색상 하나 선택
function randomColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

// 배경에 떠다니는 orb 설정 — 랜딩 페이지 5개 섹션 전체에 고르게 배치
const orbs = [
  // Hero 섹션
  { color: randomColor(), size: 500, top: "-5%",  left: "-8%",  duration: 18, delay: 0 },
  { color: randomColor(), size: 420, top: "-10%", left: "70%",  duration: 24, delay: 3 },
  // Features 섹션
  { color: randomColor(), size: 380, top: "16%",  left: "75%",  duration: 20, delay: 1 },
  { color: randomColor(), size: 350, top: "22%",  left: "-6%",  duration: 26, delay: 5 },
  // Research 섹션
  { color: randomColor(), size: 400, top: "38%",  left: "60%",  duration: 22, delay: 2 },
  { color: randomColor(), size: 320, top: "44%",  left: "-4%",  duration: 30, delay: 7 },
  // Pricing 섹션
  { color: randomColor(), size: 450, top: "58%",  left: "-10%", duration: 19, delay: 4 },
  { color: randomColor(), size: 360, top: "62%",  left: "72%",  duration: 25, delay: 1 },
  // Documentation 섹션
  { color: randomColor(), size: 400, top: "78%",  left: "15%",  duration: 21, delay: 6 },
  { color: randomColor(), size: 380, top: "82%",  left: "68%",  duration: 28, delay: 2 },
];

// 비로그인 페이지 레이아웃 — Navbar + 움직이는 배경 orb + 페이지 콘텐츠
function LoginLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden min-w-[900px]">
      <style>{`
        @keyframes orb-float {
          0%   { transform: translate(0px, 0px)    scale(1);    }
          25%  { transform: translate(40px, -30px)  scale(1.12); }
          50%  { transform: translate(-20px, 50px)  scale(0.9);  }
          75%  { transform: translate(-50px, -20px) scale(1.08); }
          100% { transform: translate(0px, 0px)    scale(1);    }
        }
      `}</style>

      {/* 클릭 이벤트 차단하고 배경만 담당하는 레이어 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {orbs.map((orb, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: orb.top,
              left: orb.left,
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: orb.color,
              opacity: 0.3,
              filter: "blur(10px)",
              animation: `orb-float ${orb.duration}s ${orb.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}

export default LoginLayout;

import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

// 파스텔톤
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

function randomColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

const orbs = [
  {
    color: randomColor(),
    size: 500,
    top: "-5%",
    left: "-8%",
    duration: 18,
    delay: 0,
  },
  {
    color: randomColor(),
    size: 420,
    top: "55%",
    left: "70%",
    duration: 22,
    delay: 3,
  },
];

function LoginLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden min-w-[900px]">
      <style>{`
        @keyframes orb-float {
          0%   { transform: translate(0px, 0px)    scale(1);    }
          25%  { transform: translate(40px, -30px)  scale(1.12); }
          50%  { transform: translate(-20px, 50px)  scale(0.9);  }
          75%  { transform: translate(-50px, -20px) scale(1.08); }
          100% { transform: translate(0px, 0px)    scale(1);    }
        }
      `}</style>

      {/* bg blur orbs */}
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
      <Outlet />
    </div>
  );
}

export default LoginLayout;

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { Link } from "react-router-dom";

// 서비스 소개 랜딩 페이지 — 비로그인 사용자가 처음 보는 화면
function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);
  return (
    <div>
      <div id="body" className="flex flex-col items-center gap-[44px]">
        {/* 상단 태그 배너 */}
        <div className="flex border-[#e5e7eb] border-3 rounded-[8px] px-[25px] py-[13px] w-[300px] h-[46px] items-center justify-center mt-[156px]">
          <p className="text-[14px] font-medium text-[#3b82f6]">
            AI를 통한 논문 검색 및 분석
          </p>
        </div>
        <div>
          <p className="font-bold text-[96px]">하나의 CLIP을 통해</p>
          <p className="font-bold text-[96px] text-[#3b82f6]">
            Unlock Knowledge
          </p>
        </div>
        <div
          id="script"
          className="flex text-center justify-center font-light text-[24px]"
        >
          "CLIP은 고도화된 AI 기반 지식 그래프를 통해 논문, 저자, 아이디어 간의
          지능적인 연결을 <br /> 구축함으로써 학술 연구의 혁신을 일으킵니다."
        </div>
        <div className="flex gap-[24px]">
          {/* CTA 버튼 — 로그인 없이 홈으로 바로 접근 (개발 중 편의) */}

          <div className="border-[#e5e7eb]-0 bg-linear-to-r from-[#3b82f6] to-[#2563eb] w-[236px] h-[68px] flex items-center justify-center rounded-[12px] text-white">
            <button onClick={() => navigate("/home")}>
              흐름 정리해보기 -{">"}
            </button>
          </div>
          <div className="border w-[218px] h-[68px] flex items-center justify-center rounded-[12px]">
            <button
              onClick={() =>
                (window.location.href =
                  "https://youtu.be/y5TJsc2b6Uo?si=Sb9KHd6z6-9U8Mf6")
              }
            >
              Watch Demo
            </button>
          </div>
        </div>
        {/* 서비스 지표 통계 */}
        <div className="flex gap-[64px] w-fill h-[118px]">
          <div className="flex flex-col w-[180px] h-[118px] items-center justify-center">
            <p className="font-bold text-[36px] text-[#3b82f6]">2.5M+</p>
            <p className="text-[#9ca3af] font-medium text-[14px]">
              보유중인 논문수
            </p>
          </div>
          <div className="flex flex-col w-[195px] h-[118px] items-center justify-center">
            <p className="font-bold text-[36px] text-[#3b82f6]">150k+ </p>
            <p className="text-[#9ca3af] font-medium text-[14px]">
              사용중인 유저
            </p>
          </div>
          <div className="flex flex-col w-[163px] h-[118px] items-center justify-center">
            <p className="font-bold text-[36px] text-[#3b82f6]">98%</p>
            <p className="text-[#9ca3af] font-medium text-[14px]">만족도지수</p>
          </div>
        </div>
      </div>

      {/* Features 섹션 */}
      <section
        id="features"
        className="flex flex-col items-center gap-[32px] py-[120px] px-[40px]"
      >
        <p className="text-[14px] font-medium text-[#3b82f6] border border-[#e5e7eb] rounded-[8px] px-[20px] py-[8px]">
          Features
        </p>
        <p className="font-bold text-[56px] text-center">강력한 AI 기능</p>
        <p className="text-[#9ca3af] text-[20px] text-center max-w-[700px]">
          CLIP은 AI 기반 논문 분석, 지식 그래프, 연구 로드맵 등 다양한 기능을
          제공합니다.
        </p>
        <div className="flex gap-[32px] mt-[20px]">
          {[
            {
              title: "AI 논문 분석",
              desc: "핵심 내용을 자동으로 요약하고 분석합니다.",
            },
            {
              title: "지식 그래프",
              desc: "논문 간의 연결 관계를 시각화합니다.",
            },
            {
              title: "연구 로드맵",
              desc: "학습 경로를 맞춤형으로 제안합니다.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-[16px] w-[280px] border border-[#e5e7eb] rounded-[16px] p-[32px]"
            >
              <p className="font-bold text-[20px]">{item.title}</p>
              <p className="text-[#9ca3af] text-[16px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research 섹션 */}
      <section
        id="research"
        className="flex flex-col items-center gap-[32px] py-[120px] px-[40px]"
      >
        <p className="text-[14px] font-medium text-[#3b82f6] border border-[#e5e7eb] rounded-[8px] px-[20px] py-[8px]">
          Research
        </p>
        <p className="font-bold text-[56px] text-center">최신 연구 트렌드</p>
        <p className="text-[#9ca3af] text-[20px] text-center max-w-[700px]">
          전 세계 최신 논문과 연구 동향을 실시간으로 확인하고 분석할 수
          있습니다.
        </p>
        <div className="flex gap-[32px] mt-[20px]">
          {[
            { stat: "2.5M+", label: "보유 논문" },
            { stat: "50K+", label: "일일 업데이트" },
            { stat: "1,200+", label: "연구 분야" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-[8px] w-[200px]"
            >
              <p className="font-bold text-[48px] text-[#3b82f6]">
                {item.stat}
              </p>
              <p className="text-[#9ca3af] text-[16px]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing 섹션 */}
      <section
        id="Team Blog"
        className="flex flex-col items-center gap-[32px] py-[120px] px-[40px]"
      >
        <p className="text-[14px] font-medium text-[#3b82f6] border border-[#e5e7eb] rounded-[8px] px-[20px] py-[8px]">
          Team Blog
        </p>
        <p className="font-bold text-[56px] text-center">
          저희의 개발이 궁금하다면?
        </p>
        <p className="text-[#9ca3af] text-[20px] text-center max-w-[700px]">
          개발자들의 블로그를 통해 CLIP의 개발 과정과 기술 스택을 확인할 수
          있습니다.
        </p>
        <div className="flex gap-[32px] mt-[20px]">
          {[
            {
              Developer: "YeJin",
              current: "준비 중..",
              desc: "PM",
              highlight: false,
            },
            {
              Developer: "WonJae",
              current: "준비 중..",
              desc: "프론트엔드, 백엔드",
              highlight: false,
            },
            {
              Developer: "EunChae",
              current: "준비 중..",
              desc: "백엔드",
              highlight: false,
            },
            {
              Developer: "BumGi",
              current: "준비 중..",
              desc: "AI",
              highlight: false,
            },
          ].map((item) => (
            <div
              key={item.plan}
              className={`flex flex-col gap-[16px] w-[280px] rounded-[16px] p-[32px] ${item.highlight ? "bg-[#3b82f6] text-white" : "border border-[#e5e7eb]"}`}
            >
              <p className="font-bold text-[20px]">{item.Developer}</p>
              <p className="font-bold text-[36px]">{item.current}</p>
              <p
                className={item.highlight ? "text-[#bfdbfe]" : "text-[#9ca3af]"}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Documentation 섹션 */}
      <section
        id="documentation"
        className="flex flex-col items-center gap-[32px] py-[120px] px-[40px]"
      >
        <p className="text-[14px] font-medium text-[#3b82f6] border border-[#e5e7eb] rounded-[8px] px-[20px] py-[8px]">
          Documentation
        </p>
        <p className="font-bold text-[56px] text-center">빠른 시작 가이드</p>
        <p className="text-[#9ca3af] text-[20px] text-center max-w-[700px]">
          CLIP을 처음 사용하는 분들을 위한 상세한 가이드와 API 문서를
          제공합니다.
        </p>
        <div className="flex gap-[32px] mt-[20px]">
          {[
            {
              title: "시작하기",
              desc: "5분 안에 CLIP을 시작하는 방법을 알아보세요.",
            },
            {
              title: "API 레퍼런스",
              desc: "CLIP API를 활용한 고급 기능을 탐색하세요.",
            },
            {
              title: "튜토리얼",
              desc: "단계별 튜토리얼로 핵심 기능을 익혀보세요.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-[16px] w-[280px] border border-[#e5e7eb] rounded-[16px] p-[32px] hover:border-[#3b82f6] transition-colors cursor-pointer"
            >
              <p className="font-bold text-[20px]">{item.title}</p>
              <p className="text-[#9ca3af] text-[16px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

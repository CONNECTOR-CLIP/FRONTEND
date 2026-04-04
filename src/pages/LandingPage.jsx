import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div>
      {/*body*/}
      <div id="body" className="flex flex-col items-center gap-[44px]">
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
          <div className="border-[#e5e7eb]-0 bg-linear-to-r from-[#3b82f6] to-[#2563eb] w-[236px] h-[68px] flex items-center justify-center rounded-[12px] text-white">
            <button onClick={() => navigate("/home")}></button>
            흐름 정리해보기 -{">"}
          </div>
          <div className="border w-[218px] h-[68px] flex items-center justify-center rounded-[12px]">
            <button onClick={() => navigate("/Demo")}>Watch Demo</button>
          </div>
        </div>
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
    </div>
  );
}

export default LandingPage;

import { useLocation, useNavigate } from "react-router-dom";

function SignupCompletePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const nickname = state?.nickname ?? "OO";

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl w-[320px] px-10 py-10 flex flex-col items-center gap-6 shadow-xl">
        <p className="text-sm text-gray-400">회원가입</p>

        <div className="w-14 h-14 rounded-full bg-[#EEF2FF] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#1D4ED8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xl font-bold leading-snug">
            {nickname} 님의 회원가입이
            <br />
            완료 되었어요.
          </p>
          <p className="text-sm text-gray-400">다양한 흐름을 파악해보세요.</p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full h-11 bg-[#0060AD] text-white text-sm font-semibold rounded-lg hover:bg-[#1a42c0] transition-colors"
        >
          로그인 화면으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default SignupCompletePage;

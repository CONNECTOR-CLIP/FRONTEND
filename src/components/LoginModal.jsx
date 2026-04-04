import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const [saveId, setSaveId] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[620px] px-10 py-10 flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1 mb-[40px]">
          <h2 className="text-2xl font-extrabold text-[#1D4ED8]">CLIP</h2>
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-[15px]  font-bold">다시 만나 반가워요.</p>
          <div className="flex flex-col gap-1">
            <label className="text-regular font-light text-[12px] text-gray-700">
              로그인
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0060AD] focus:ring-1 focus:ring-[#0060AD]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0060AD] focus:ring-1 focus:ring-[#0060AD]"
            />
          </div>
          <div className="flex items-center gap-4 justify-between mb-[22px]">
            <div className="flex gap-[12px]">
              <button
                type="button"
                onClick={() => setSaveId(!saveId)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  saveId
                    ? "border-[#99b4dc] bg-[#0060AD]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {saveId && <div className="w-2 h-2 rounded-full bg-white" />}
              </button>
              <span className="text-sm text-gray-600">아이디 저장하기</span>
            </div>
            <div>
              <button className="text-sm text-[#0060AD] hover:underline">
                아이디
              </button>
              <button className="text-sm text-[#0060AD] hover:underline">
                /비밀번호 찾기
              </button>
            </div>
          </div>
        </div>

        <button className="w-full h-[48px] bg-[#007aff] text-white font-bold rounded-lg hover:bg-[#004f91] transition-colors">
          로그인
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는 소셜 로그인</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3 ">
          {/* 구글 */}
          <button className="flex flex-1 items-center justify-center gap-2 h-[40px] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg width="18" height="40" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            <span className="text-sm text-gray-700">구글로 시작하기</span>
          </button>

          {/* 네이버 */}
          <button className="flex overflow-hidden items-center justify-center gap-1.5 rounded-lg h-[40px] hover:opacity-90 transition-opacity bg-[#03A94D]">
            <span className="text-white font-extrabold text-base leading-none">
              N
            </span>
            <span className="text-sm text-white font-medium">
              네이버로 시작하기
            </span>
          </button>

          {/* 카카오 */}
          <button className="flex flex-1 items-center justify-center gap-2 h-[40px] bg-[#FEE500] rounded-lg hover:bg-[#f0d800] transition-colors">
            <svg width="18" height="40" viewBox="0 0 24 24" fill="#3C1E1E">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.55 1.463 4.792 3.68 6.18-.162.57-.588 2.07-.673 2.39-.106.394.144.39.303.284.125-.083 1.98-1.342 2.78-1.882.613.09 1.244.138 1.91.138 5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
            </svg>
            <span className="text-sm text-[15px] text-[#3C1E1E] font-medium">
              카카오로 시작하기
            </span>
          </button>
        </div>

        <p className="text-center text-sm text-[#64748B] mt-4">
          계정이 없으신가요?{" "}
          <span
            onClick={() => { onClose(); navigate("/signup"); }}
            className="text-[#0060AD] font-semibold cursor-pointer hover:underline"
          >
            회원가입
          </span>
        </p>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default LoginModal;

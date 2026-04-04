function LoginModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[400px] px-10 py-10 flex flex-col gap-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-[#1D4ED8]">CLIP</h2>
          <p className="text-[15px] text-[#64748B]">계정에 로그인하세요</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              placeholder="email@example.com"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0060AD] focus:ring-1 focus:ring-[#0060AD]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0060AD] focus:ring-1 focus:ring-[#0060AD]"
            />
          </div>
        </div>

        <button className="w-full h-[48px] bg-[#0060AD] text-white font-bold rounded-lg hover:bg-[#004f91] transition-colors">
          로그인
        </button>

        <p className="text-center text-sm text-[#64748B]">
          계정이 없으신가요?{" "}
          <span className="text-[#0060AD] font-semibold cursor-pointer hover:underline">
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

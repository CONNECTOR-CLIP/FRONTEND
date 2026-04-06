import { useState } from "react";
import { useNavigate } from "react-router-dom";

const USED_IDS = ["admin", "user123", "clip"];
const USED_NICKNAMES = ["관리자", "운영자", "clip"];
const USED_EMAILS = ["test@test.com", "admin@clip.com"];

function SignupPage() {
  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    id: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    id: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    email: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const validators = {
    id: (v) => {
      if (/[^a-zA-Z0-9가-힣]/.test(v))
        return "특수문자가 들어있습니다. 특수문자를 제외해주세요.";
      if (v.length < 4) return "아이디는 4자 이상이어야 합니다.";
      if (v.length > 20) return "아이디는 20자 이하여야 합니다.";
      if (USED_IDS.includes(v)) return "이미 사용 중인 아이디입니다.";
      return "";
    },
    password: (v) => {
      if (v.length < 5 || !/[!@#$%^&*(),.?":{}|<>_\-]/.test(v))
        return "최소 길이 5, 특수문자 1개를 포함해주세요.";
      return "";
    },
    passwordConfirm: (v, f) => {
      if (v !== f.password) return "비밀번호가 일치하지 않습니다.";
      return "";
    },
    nickname: (v) => {
      if (USED_NICKNAMES.includes(v)) return "이미 사용 중인 닉네임입니다.";
      return "";
    },
    email: (v) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        return "정확한 이메일을 입력해주세요.";
      if (USED_EMAILS.includes(v)) return "이미 사용 중인 이메일입니다.";
      return "";
    },
  };

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    const err = value
      ? field === "passwordConfirm"
        ? validators.passwordConfirm(value, updated)
        : validators[field]?.(value)
      : "";
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = () => {
    if (
      !form.id ||
      !form.password ||
      !form.passwordConfirm ||
      !form.nickname ||
      !form.email
    ) {
      showToast("항목을 모두 작성해 주세요.");
      return;
    }
    const newErrors = {
      id: validators.id(form.id),
      password: validators.password(form.password),
      passwordConfirm: validators.passwordConfirm(form.passwordConfirm, form),
      nickname: validators.nickname(form.nickname),
      email: validators.email(form.email),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    if (!emailVerified) {
      showToast("이메일을 인증해주세요.");
      return;
    }
    navigate("/signup/complete", { state: { nickname: form.nickname } });
  };

  const handleSendEmail = () => {
    const emailErr = form.email
      ? validators.email(form.email)
      : "이메일을 입력해주세요.";
    if (emailErr) {
      setErrors((prev) => ({ ...prev, email: emailErr }));
      return;
    }
    setEmailSent(true);
    setEmailVerified(false);
    showToast("인증 메일을 발송했습니다.");
  };

  const inputClass = (field) =>
    `border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 ${
      errors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
        : "border-gray-300 focus:border-[#0060AD] focus:ring-[#0060AD]"
    }`;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] py-12">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white text-sm px-6 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl w-[480px] px-10 py-10 flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-[#1D4ED8]">CLIP</h2>
          <p className="text-[15px] font-bold mt-4">새 계정을 만들어보세요.</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* 아이디 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                아이디
              </label>
              {errors.id && (
                <span className="text-xs text-red-500">{errors.id}</span>
              )}
            </div>
            <input
              type="text"
              value={form.id}
              onChange={(e) => handleChange("id", e.target.value)}
              placeholder="아이디를 입력해주세요 (4~20자)"
              className={inputClass("id")}
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password}</span>
              )}
            </div>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="5자 이상, 특수문자 1개 포함"
              className={inputClass("password")}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              {errors.passwordConfirm && (
                <span className="text-xs text-red-500">
                  {errors.passwordConfirm}
                </span>
              )}
            </div>
            <input
              type="password"
              value={form.passwordConfirm}
              onChange={(e) => handleChange("passwordConfirm", e.target.value)}
              placeholder="비밀번호를 다시 입력해주세요"
              className={inputClass("passwordConfirm")}
            />
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                닉네임
              </label>
              {errors.nickname && (
                <span className="text-xs text-red-500">{errors.nickname}</span>
              )}
            </div>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => handleChange("nickname", e.target.value)}
              placeholder="닉네임을 입력해주세요"
              className={inputClass("nickname")}
            />
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                이메일
              </label>
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  handleChange("email", e.target.value);
                  setEmailSent(false);
                  setEmailVerified(false);
                }}
                placeholder="email@example.com"
                className={`flex-1 ${inputClass("email")}`}
              />
              <button
                type="button"
                onClick={handleSendEmail}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-[#0060AD] text-[#0060AD] hover:bg-blue-50 whitespace-nowrap transition-colors"
              >
                {emailSent ? "재발송" : "인증하기"}
              </button>
            </div>
            {emailSent && !emailVerified && (
              <button
                type="button"
                onClick={() => setEmailVerified(true)}
                className="mt-1 text-xs text-[#0060AD] underline text-left"
              >
                인증 완료 (테스트용)
              </button>
            )}
            {emailVerified && (
              <span className="mt-1 text-xs text-green-500">
                이메일 인증이 완료되었습니다.
              </span>
            )}
          </div>

        </div>

        <button
          onClick={handleSubmit}
          className="w-full h-12 font-bold rounded-lg transition-colors text-white bg-[#007aff] hover:bg-[#004f91]"
        >
          회원가입
        </button>

        <p className="text-center text-sm text-[#64748B]">
          이미 계정이 있으신가요?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-[#0060AD] font-semibold cursor-pointer hover:underline"
          >
            로그인
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

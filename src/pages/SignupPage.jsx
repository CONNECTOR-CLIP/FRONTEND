import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api";

// 임시 중복 체크용 목록 — 실제 서비스에선 서버 API로 대체 필요
const USED_IDS = ["admin", "user123", "clip"];
const USED_NICKNAMES = ["관리자", "운영자", "clip"];
const USED_EMAILS = ["test@test.com", "admin@clip.com"];

// 회원가입 페이지 — 아이디/비밀번호/닉네임/이메일 입력 및 이메일 인증 포함
function SignupPage() {
  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSentMsg, setEmailSentMsg] = useState("");
  const [emailVerifyError, setEmailVerifyError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

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

  // 각 필드별 유효성 검사 함수 모음
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
      if (v.length < 8 || v.length > 20 || !/[!@#$%^&*(),.?":{}|<>_\-]/.test(v))
        return "8~20자, 특수문자 1개를 포함해주세요.";
      return "";
    },
    // passwordConfirm은 form 전체를 받아 password와 비교
    passwordConfirm: (v, f) => {
      if (v !== f.password) return "비밀번호가 일치하지 않습니다.";
      return "";
    },
    nickname: (v) => {
      if (v.length < 2) return "닉네임은 2자 이상이어야 합니다.";
      if (v.length > 20) return "닉네임은 20자 이하여야 합니다.";
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

  // 입력 변경 시 해당 필드 유효성 즉시 검사
  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    // 빈 값이면 에러 표시하지 않음 (입력 시작 전에 빨간 테두리 방지)
    const err = value
      ? field === "passwordConfirm"
        ? validators.passwordConfirm(value, updated)
        : validators[field]?.(value)
      : "";
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async () => {
    setGeneralError("");
    setEmailVerifyError("");

    // 빈 항목은 해당 필드 아래에 에러 표시
    const emptyErrors = {
      id: form.id ? "" : "필수 항목입니다.",
      password: form.password ? "" : "필수 항목입니다.",
      passwordConfirm: form.passwordConfirm ? "" : "필수 항목입니다.",
      nickname: form.nickname ? "" : "필수 항목입니다.",
      email: form.email ? "" : "필수 항목입니다.",
    };
    if (Object.values(emptyErrors).some(Boolean)) {
      setErrors(emptyErrors);
      return;
    }

    // 최종 유효성 재검사 — 모든 필드 한 번에 확인
    const newErrors = {
      id: validators.id(form.id),
      password: validators.password(form.password),
      passwordConfirm: validators.passwordConfirm(form.passwordConfirm, form),
      nickname: validators.nickname(form.nickname),
      email: validators.email(form.email),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    // 이메일 인증 미완료 시 이메일 입력칸 아래에 표시
    if (!emailVerified) {
      setEmailVerifyError("이메일을 인증해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.signup({
        userId: form.id,
        password: form.password,
        nickname: form.nickname,
        email: form.email,
      });
      // 완료 페이지에 닉네임 전달해서 환영 메시지에 사용
      navigate("/signup/complete", { state: { nickname: form.nickname } });
    } catch (error) {
      const msg =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        "회원가입에 실패했습니다.";
      if (msg.includes("아이디") || msg.toLowerCase().includes("userid") || msg.toLowerCase().includes("id")) {
        setErrors((prev) => ({ ...prev, id: msg }));
      } else if (msg.includes("닉네임") || msg.toLowerCase().includes("nickname")) {
        setErrors((prev) => ({ ...prev, nickname: msg }));
      } else if (msg.includes("이메일") || msg.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: msg }));
      } else {
        setGeneralError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = () => {
    // 이메일 유효성 먼저 검사 후 발송
    const emailErr = form.email
      ? validators.email(form.email)
      : "이메일을 입력해주세요.";
    if (emailErr) {
      setErrors((prev) => ({ ...prev, email: emailErr }));
      return;
    }
    setEmailSent(true);
    setEmailVerified(false);
    setEmailVerifyError("");
    setEmailSentMsg("인증 메일을 발송했습니다.");
  };

  // 에러 여부에 따라 input 테두리 색상 변경
  const inputClass = (field) =>
    `border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 ${
      errors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
        : "border-gray-300 focus:border-[#0060AD] focus:ring-[#0060AD]"
    }`;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] py-12">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl w-[480px] px-10 py-10 flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-[#1D4ED8]">CLIP</h2>
          <p className="text-[15px] font-bold mt-4">새 계정을 만들어보세요.</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* 아이디 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">아이디</label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => handleChange("id", e.target.value)}
              placeholder="아이디를 입력해주세요 (4~20자)"
              className={inputClass("id")}
            />
            {errors.id && (
              <span className="text-xs text-red-500">{errors.id}</span>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="8~20자, 특수문자 1개 포함"
              className={inputClass("password")}
            />
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
            <input
              type="password"
              value={form.passwordConfirm}
              onChange={(e) => handleChange("passwordConfirm", e.target.value)}
              placeholder="비밀번호를 다시 입력해주세요"
              className={inputClass("passwordConfirm")}
            />
            {errors.passwordConfirm && (
              <span className="text-xs text-red-500">{errors.passwordConfirm}</span>
            )}
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">닉네임</label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => handleChange("nickname", e.target.value)}
              placeholder="닉네임을 입력해주세요"
              className={inputClass("nickname")}
            />
            {errors.nickname && (
              <span className="text-xs text-red-500">{errors.nickname}</span>
            )}
          </div>

          {/* 이메일 + 인증 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">이메일</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  handleChange("email", e.target.value);
                  // 이메일 수정 시 인증 상태 초기화
                  setEmailSent(false);
                  setEmailVerified(false);
                  setEmailSentMsg("");
                  setEmailVerifyError("");
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
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
            {emailSentMsg && !emailVerified && (
              <span className="text-xs text-blue-500">{emailSentMsg}</span>
            )}
            {/* 테스트용 인증 완료 버튼 — 실제 이메일 링크 없이 인증 상태를 강제로 통과 */}
            {emailSent && !emailVerified && (
              <button
                type="button"
                onClick={() => {
                  setEmailVerified(true);
                  setEmailSentMsg("");
                  setEmailVerifyError("");
                }}
                className="text-xs text-[#0060AD] underline text-left"
              >
                인증 완료 (테스트용)
              </button>
            )}
            {emailVerified && (
              <span className="text-xs text-green-500">
                이메일 인증이 완료되었습니다.
              </span>
            )}
            {emailVerifyError && (
              <span className="text-xs text-red-500">{emailVerifyError}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-12 font-bold rounded-lg transition-colors text-white bg-[#007aff] hover:bg-[#004f91] disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </button>
          {generalError && (
            <span className="text-xs text-red-500 text-center">{generalError}</span>
          )}
        </div>

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

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { usersApi } from "@/api/users";
import { bookmarksApi } from "@/api/bookmarks";

// ─── 아이콘 컴포넌트 모음 ────────────────────────────────
function IconUser() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function IconBookmark() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}
function IconKey() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}
function IconX({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function IconPen() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

// ─── 공통 검색 입력 컴포넌트 ──────────────────────────────
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3 focus-within:border-[#1D4ED8] shadow-sm transition-all">
      <IconSearch />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-[#1E293B] placeholder-[#CBD5E1] outline-none"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-[#CBD5E1] hover:text-[#94A3B8]">
          <IconX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// 2.5초 후 자동 사라지는 토스트 메시지
function Toast({ msg, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white
      ${type === "success" ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}>
      {msg}
    </div>
  );
}

// 확인/취소 다이얼로그 — danger=true 이면 확인 버튼을 빨간색으로 표시
function ConfirmDialog({ title, message, confirmLabel = "확인", cancelLabel = "취소", onConfirm, onCancel, danger = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 flex flex-col gap-4">
        <h3 className="text-base font-bold text-[#1E293B]">{title}</h3>
        <p className="text-sm text-[#64748B] leading-relaxed">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#1E293B] transition-colors">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold rounded-xl transition-colors text-white
              ${danger ? "bg-[#EF4444] hover:bg-[#DC2626]" : "bg-[#1D4ED8] hover:bg-[#1E40AF]"}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 계정 설정 섹션 ────────────────────────────────────────
// 닉네임 변경, 비밀번호 변경, 회원 탈퇴 기능 포함
function AccountSection({ user, onUserUpdate, onDeleteAccount }) {
  const [nicknameEdit, setNicknameEdit] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [pwEdit, setPwEdit] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // 입력 중 실시간 유효성 검사
  const handleNicknameChange = (val) => {
    setNewNickname(val);
    if (val.length > 10) {
      setNicknameError("닉네임은 10자 이하로 입력해주세요.");
    } else if (val.trim() === user?.nickname) {
      setNicknameError("현재 닉네임과 동일합니다.");
    } else {
      setNicknameError("");
    }
  };

  const handleNicknameSave = async () => {
    if (!newNickname.trim()) return showToast("닉네임을 입력해주세요.", "error");
    if (newNickname.trim().length > 10) return showToast("닉네임은 10자 이하로 입력해주세요.", "error");
    if (newNickname.trim() === user?.nickname) return showToast("현재 닉네임과 동일합니다.", "error");
    setLoading(true);
    try {
      await usersApi.updateNickname({ nickname: newNickname.trim() });
      // 부모 컴포넌트의 user 상태도 같이 갱신
      onUserUpdate({ ...user, nickname: newNickname.trim() });
      setNicknameEdit(false);
      setNewNickname("");
      setNicknameError("");
      showToast("닉네임이 변경되었습니다.");
    } catch {
      showToast("닉네임 변경에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!currentPw || !newPw) return showToast("모든 항목을 입력해주세요.", "error");
    if (newPw !== confirmPw) return showToast("새 비밀번호가 일치하지 않습니다.", "error");
    if (newPw.length < 8) return showToast("비밀번호는 8자 이상이어야 합니다.", "error");
    setLoading(true);
    try {
      await usersApi.changePassword({ password: newPw });
      setPwEdit(false);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      showToast("비밀번호가 변경되었습니다.");
    } catch {
      showToast("비밀번호 변경에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* 프로필 카드 */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
          <svg className="w-8 h-8 text-[#6366F1]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-bold text-[#1E293B]">{user?.nickname ?? "—"}</p>
          <p className="text-sm text-[#94A3B8] mt-0.5">{user?.email ?? "—"}</p>
          <p className="text-xs text-[#CBD5E1] mt-0.5">ID: {user?.userId ?? "—"}</p>
        </div>
      </div>

      {/* 닉네임 변경 */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1E293B]">닉네임 변경</h3>
          {!nicknameEdit && (
            <button onClick={() => { setNicknameEdit(true); setNewNickname(user?.nickname ?? ""); setNicknameError(""); }}
              className="flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#4F46E5]">
              <IconPen /> 수정
            </button>
          )}
        </div>
        {nicknameEdit ? (
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-[#94A3B8] mb-1">현재 닉네임</p>
              <div className="px-4 py-2.5 bg-[#F8FAFC] rounded-xl text-sm text-[#94A3B8] border border-[#E2E8F0]">
                {user?.nickname}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] mb-1">변경할 닉네임 <span className="text-[#CBD5E1]">(최대 10자)</span></p>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                maxLength={10}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1E293B] focus:outline-none transition-colors
                  ${nicknameError ? "border-[#EF4444] focus:border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#1D4ED8]"}`}
                placeholder="새 닉네임 입력"
              />
              <div className="flex items-center justify-between mt-1">
                {nicknameError ? (
                  <p className="text-xs text-[#EF4444]">{nicknameError}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-[#94A3B8]">{newNickname.length}/10</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setNicknameEdit(false); setNicknameError(""); }}
                className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                취소
              </button>
              {/* 에러가 있거나 빈 값이면 비활성화 */}
              <button onClick={handleNicknameSave} disabled={loading || !!nicknameError || !newNickname.trim()}
                className="px-5 py-2 text-sm bg-[#1D4ED8] text-white rounded-xl hover:bg-[#1E40AF] disabled:opacity-50 transition-colors">
                변경
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#64748B]">현재 닉네임: <span className="font-medium text-[#1E293B]">{user?.nickname}</span></p>
        )}
      </div>

      {/* 비밀번호 변경 */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1E293B]">비밀번호 변경</h3>
          {!pwEdit && (
            <button onClick={() => setPwEdit(true)}
              className="flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#4F46E5]">
              <IconPen /> 수정
            </button>
          )}
        </div>
        {pwEdit ? (
          <div className="flex flex-col gap-3">
            {/* 3개 입력 필드를 배열로 렌더링 */}
            {[
              { label: "현재 비밀번호", val: currentPw, set: setCurrentPw },
              { label: "새 비밀번호", val: newPw, set: setNewPw },
              { label: "새 비밀번호 확인", val: confirmPw, set: setConfirmPw },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <p className="text-xs text-[#94A3B8] mb-1">{label}</p>
                <input type="password" value={val} onChange={(e) => set(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1D4ED8]"
                  placeholder="••••••••" />
              </div>
            ))}
            <div className="flex gap-2 justify-end mt-1">
              <button onClick={() => { setPwEdit(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}
                className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                취소
              </button>
              <button onClick={handlePasswordSave} disabled={loading}
                className="px-5 py-2 text-sm bg-[#1D4ED8] text-white rounded-xl hover:bg-[#1E40AF] disabled:opacity-50 transition-colors">
                변경
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#64748B]">비밀번호를 변경하려면 수정 버튼을 눌러주세요.</p>
        )}
      </div>

      {/* 회원 탈퇴 — 되돌릴 수 없는 작업이므로 별도 확인 다이얼로그 거침 */}
      <div className="bg-white rounded-2xl border border-[#FEE2E2] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#EF4444]">회원 탈퇴</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">탈퇴 후 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#EF4444] border border-[#FCA5A5] rounded-xl hover:bg-[#FEF2F2] transition-colors">
            <IconTrash />
            탈퇴하기
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="회원 탈퇴"
          message="정말로 탈퇴하시겠습니까? 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다."
          confirmLabel="탈퇴하기"
          danger
          onConfirm={onDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

// ─── 내 북마크 섹션 ────────────────────────────────────────
// 논문 북마크와 Gap 북마크를 탭으로 구분하여 표시
function BookmarkSection() {
  const [tab, setTab] = useState("paper"); // "paper" | "gap"
  const [bookmarks, setBookmarks] = useState([]);
  const [gapBookmarks, setGapBookmarks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookmarksApi.getBookmarks();
      const list = Array.isArray(data) ? data : data?.bookmarks ?? data?.content ?? [];
      setBookmarks(list);
    } catch {
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGapBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookmarksApi.getGapBookmarks();
      const list = Array.isArray(data) ? data : data?.bookmarks ?? data?.content ?? [];
      setGapBookmarks(list);
    } catch {
      setGapBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 탭 전환 시 해당 데이터 로드
  useEffect(() => {
    if (tab === "paper") fetchBookmarks();
    else fetchGapBookmarks();
  }, [tab, fetchBookmarks, fetchGapBookmarks]);

  const handleRemove = async (id) => {
    try {
      await bookmarksApi.removePaperBookmark(id);
      // 서버 확인 후 로컬 상태에서도 제거
      setBookmarks((prev) => prev.filter((b) => (b.paperId ?? b.paper_id ?? b.id) !== id));
      showToast("북마크가 삭제되었습니다.");
    } catch {
      showToast("삭제에 실패했습니다.", "error");
    }
  };

  const handleRemoveGap = async (id) => {
    try {
      await bookmarksApi.removeGapBookmark(id);
      setGapBookmarks((prev) => prev.filter((b) => b.id !== id));
      showToast("Gap 북마크가 삭제되었습니다.");
    } catch {
      showToast("삭제에 실패했습니다.", "error");
    }
  };

  // 검색어 기준 클라이언트 사이드 필터링
  const filtered = bookmarks.filter((b) => {
    const title = b.title ?? b.paperTitle ?? b.paper_id ?? "";
    return !query || title.toLowerCase().includes(query.toLowerCase());
  });

  const filteredGap = gapBookmarks.filter((b) => {
    const title = b.title ?? "";
    return !query || title.toLowerCase().includes(query.toLowerCase());
  });

  const TABS = [
    { key: "paper", label: "내 논문" },
    { key: "gap", label: "내 Gap" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* 탭 전환 — 탭 변경 시 검색어도 초기화 */}
      <div className="flex gap-1 bg-[#F1F5F9] rounded-xl p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => { setTab(key); setQuery(""); }}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all
              ${tab === key ? "bg-white text-[#1D4ED8] shadow-sm" : "text-[#64748B] hover:text-[#1E293B]"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "paper" && (
        <>
          <SearchBar value={query} onChange={setQuery} placeholder="저장한 논문 검색..." />

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <svg className="w-10 h-10 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-sm text-[#94A3B8]">
                {query ? "검색 결과가 없습니다." : "저장된 논문이 없습니다."}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
              <ul>
                {filtered.map((b, i) => {
                  const id = b.paperId ?? b.paper_id ?? b.id ?? i;
                  const title = b.title ?? b.paperTitle ?? id;
                  const category = b.category ?? b.privaryCategory ?? "";
                  return (
                    // 클릭 시 해당 논문 제목으로 로드맵 검색
                    <li key={id} className="flex items-center gap-4 px-6 py-4 border-b border-[#F1F5F9] last:border-0
                      hover:bg-[#F8FAFC] group cursor-pointer transition-colors"
                      onClick={() => navigate("/roadmap", { state: { query: title } })}>
                      <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1E293B] truncate">{title}</p>
                        {category && <p className="text-xs text-[#94A3B8] mt-0.5">{category}</p>}
                      </div>
                      {/* 삭제 버튼 — hover 시에만 보이고, 행 클릭과 충돌 방지 */}
                      <button onClick={(e) => { e.stopPropagation(); handleRemove(id); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#CBD5E1] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-all">
                        <IconX />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}

      {tab === "gap" && (
        <>
          <SearchBar value={query} onChange={setQuery} placeholder="저장한 Gap 분석 검색..." />

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredGap.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <svg className="w-10 h-10 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-sm text-[#94A3B8]">
                {query ? "검색 결과가 없습니다." : "저장된 Gap 분석 결과가 없습니다."}
              </p>
              {!query && (
                <button onClick={() => navigate("/roadmap")}
                  className="mt-1 text-sm text-[#1D4ED8] hover:underline">
                  로드맵에서 갭 분석 시작하기 →
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
              <ul>
                {filteredGap.map((b) => {
                  // content 필드가 JSON 문자열일 수 있으므로 파싱 시도
                  let parsedContent = null;
                  try { parsedContent = b.content ? JSON.parse(b.content) : null; } catch {}
                  const summary = parsedContent?.backgroundAndGap ?? parsedContent?.description ?? "";
                  return (
                    <li key={b.id}
                      className="flex items-start gap-4 px-6 py-4 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] group transition-colors">
                      <div className="w-9 h-9 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1E293B] truncate">{b.title || "Gap 아이디어"}</p>
                        {summary && (
                          <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2">{summary}</p>
                        )}
                        {b.keyword && (
                          <span className="inline-block mt-1 text-xs text-[#6366F1] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                            {b.keyword}
                          </span>
                        )}
                      </div>
                      <button onClick={() => handleRemoveGap(b.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#CBD5E1] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-all shrink-0">
                        <IconX />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── 관심 키워드 섹션 ──────────────────────────────────────
// localStorage에 저장하는 관심 키워드 관리 — 클릭 시 Research 페이지로 자동 검색
function KeywordSection() {
  const STORAGE_KEY = "clip_interest_keywords";
  // 초기 상태를 localStorage에서 로드 (파싱 실패 시 빈 배열)
  const [keywords, setKeywords] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
    catch { return []; }
  });
  const [input, setInput] = useState("");
  const [confirmKw, setConfirmKw] = useState(null);
  const navigate = useNavigate();

  const addKeyword = () => {
    const kw = input.trim();
    // 빈 값이거나 이미 있는 키워드면 무시
    if (!kw || keywords.includes(kw)) return;
    const next = [...keywords, kw];
    setKeywords(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setInput("");
  };

  const removeKeyword = (kw) => {
    const next = keywords.filter((k) => k !== kw);
    setKeywords(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  // 키워드 클릭 시 바로 이동하지 않고 확인 다이얼로그 먼저 띄움
  const goToSearch = (kw) => {
    setConfirmKw(kw);
  };

  const handleConfirmNavigate = () => {
    const kw = confirmKw;
    setConfirmKw(null);
    navigate("/Research", { state: { autoSearch: kw } });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 키워드 추가 입력 — Enter로도 추가 가능 */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3 focus-within:border-[#1D4ED8] shadow-sm transition-all">
          <IconSearch />
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            placeholder="관심 키워드 추가..."
            className="flex-1 bg-transparent text-sm text-[#1E293B] placeholder-[#CBD5E1] outline-none" />
        </div>
        <button onClick={addKeyword}
          className="px-5 py-3 text-sm font-semibold bg-[#1D4ED8] text-white rounded-2xl hover:bg-[#1E40AF] transition-colors">
          추가
        </button>
      </div>

      {keywords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <svg className="w-10 h-10 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-sm text-[#94A3B8]">저장된 관심 키워드가 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex flex-wrap gap-2.5">
            {keywords.map((kw) => (
              <div key={kw}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EEF2FF] rounded-full group cursor-pointer hover:bg-[#E0E7FF] transition-colors"
                onClick={() => goToSearch(kw)}>
                <span className="text-sm font-medium text-[#4F46E5]">{kw}</span>
                {/* X 버튼 — 클릭이 부모의 goToSearch와 겹치지 않도록 stopPropagation */}
                <button onClick={(e) => { e.stopPropagation(); removeKeyword(kw); }}
                  className="text-[#A5B4FC] hover:text-[#EF4444] transition-colors">
                  <IconX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 이동 전 확인 다이얼로그 */}
      {confirmKw && (
        <ConfirmDialog
          title="검색으로 이동"
          message={`"${confirmKw}" 키워드로 검색하시겠습니까?`}
          confirmLabel="검색하기"
          onConfirm={handleConfirmNavigate}
          onCancel={() => setConfirmKw(null)}
        />
      )}
    </div>
  );
}

// ─── 마이페이지 메인 컴포넌트 ─────────────────────────────
// 사이드바 메뉴 + 우측 콘텐츠 레이아웃
const MENU = [
  { key: "account", label: "계정 설정", icon: <IconUser /> },
  { key: "bookmark", label: "북마크", icon: <IconBookmark /> },
  { key: "keyword", label: "관심 키워드", icon: <IconKey /> },
];

function MyPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState("account");
  const [user, setUser] = useState(null);

  // 마운트 시 유저 정보 로드 — 실패해도 페이지는 정상 표시
  useEffect(() => {
    usersApi.getInformation()
      .then(setUser)
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      await usersApi.deleteAccount();
      logout();
      navigate("/");
    } catch {
      // 탈퇴 실패 시 별도 UI 없이 조용히 처리 (사용자는 그대로 페이지에 남음)
    }
  };

  const SECTION_TITLES = {
    account: "계정 설정",
    bookmark: "북마크",
    keyword: "관심 키워드",
  };

  return (
    <div className="mx-auto max-w-screen-xl px-8 py-10 flex gap-8 min-h-[calc(100vh-64px)]">

      {/* 왼쪽 사이드바 — 메뉴 + 하단 로그아웃 버튼 */}
      <aside className="w-52 shrink-0 flex flex-col justify-between">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <ul>
            {MENU.map(({ key, label, icon }) => (
              <li key={key}>
                <button onClick={() => setActiveMenu(key)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors border-b border-[#F1F5F9] last:border-0
                    ${activeMenu === key
                      ? "bg-[#EEF2FF] text-[#4F46E5]"
                      : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"}`}>
                  <span className={activeMenu === key ? "text-[#6366F1]" : "text-[#94A3B8]"}>
                    {icon}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2] rounded-xl transition-colors">
          <IconLogout />
          로그아웃
        </button>
      </aside>

      {/* 오른쪽 콘텐츠 — 선택된 메뉴에 따라 섹션 전환 */}
      <main className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-[#173355] mb-6">{SECTION_TITLES[activeMenu]}</h1>

        {activeMenu === "account" && (
          <AccountSection user={user} onUserUpdate={setUser} onDeleteAccount={handleDeleteAccount} />
        )}
        {activeMenu === "bookmark" && <BookmarkSection />}
        {activeMenu === "keyword" && <KeywordSection />}
      </main>
    </div>
  );
}

export default MyPage;

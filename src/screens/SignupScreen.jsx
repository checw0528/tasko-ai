import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

/**
 * Supabase 회원가입 에러를 한국어 문구로 바꾼다
 */
function getSignupErrorMessage(error) {
  const code = error.code;
  const message = error.message || '';

  if (code === 'user_already_exists' || message.includes('already registered')) {
    return '이미 가입된 이메일입니다.';
  }
  if (code === 'weak_password' || message.includes('at least 6 characters')) {
    return '비밀번호는 6자 이상이어야 합니다.';
  }
  if (code === 'email_address_invalid' || code === 'validation_failed' || message.includes('invalid format')) {
    return '올바른 이메일 주소를 입력해 주세요.';
  }
  if (code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit' || message.includes('rate limit')) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
  }
  if (message.includes('Failed to fetch')) {
    return '인터넷 연결을 확인해 주세요.';
  }
  return '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.';
}

/**
 * Tasko 모바일 회원가입 화면
 * - 이메일·비밀번호로 Supabase에 가입합니다.
 * - 이메일 인증이 꺼져 있으면 바로 대시보드(/dashboard)로, 켜져 있으면 안내 문구를 보여 줍니다.
 * - 실패하면 폼 아래에 한국어 에러 문구를 보여 줍니다.
 */
export default function SignupScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 회원가입 버튼 처리
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setNoticeMessage('');

    // 서버에 보내기 전에 화면에서 먼저 확인한다
    if (password.length < 6) {
      setErrorMessage('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호가 서로 다릅니다.');
      return;
    }

    // 연결값(.env.local)이 없으면 가입할 수 없다
    if (!supabase) {
      setErrorMessage('서버 연결 설정이 없습니다. 관리자에게 문의해 주세요.');
      return;
    }

    setIsLoading(true);
    const result = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });
    setIsLoading(false);

    if (result.error) {
      setErrorMessage(getSignupErrorMessage(result.error));
      return;
    }

    // 가입과 동시에 로그인 상태(session)가 생기면 대시보드로 이동한다
    if (result.data.session) {
      navigate('/dashboard');
      return;
    }

    // session이 없으면 이메일 인증이 필요한 설정이다: 안내 문구를 보여 준다
    setNoticeMessage('인증 메일을 보냈습니다. 메일을 확인한 뒤 로그인해 주세요.');
  }

  // 요청 중에는 버튼 글자를 바꾼다
  let buttonLabel = '회원가입';
  if (isLoading) {
    buttonLabel = '가입 중...';
  }

  return (
    <div className="w-full h-full bg-[#F8F9FA] dark:bg-[#121417] flex flex-col justify-between select-none">
      {/* 상단 헤더 */}
      <header className="pt-4 px-7 flex items-center justify-between z-10 shrink-0">
        <span className="text-[13px] font-medium text-[#495057] dark:text-[#ADB5BD] tracking-tight">Tasko Mobile</span>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1EA65C] inline-block"></span>
          <span className="text-[13px] font-medium text-[#495057] dark:text-[#ADB5BD]">Online</span>
        </div>
      </header>

      {/* 중앙 메인 컨텐츠: 브랜드 및 회원가입 입력 필드 */}
      <section className="px-7 w-full flex flex-col items-center">
        {/* 브랜드 로고 & 타이틀 */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1EA65C] flex items-center justify-center text-white shadow-sm">
              <svg aria-hidden="true" className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#212529] dark:text-[#F1F3F5]">Tasko</h1>
          </div>
          <p className="text-[14px] text-[#495057] dark:text-[#ADB5BD] font-medium tracking-tight">이메일로 간단하게 시작하세요</p>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5">
          {/* 항목 1: 이메일 */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#495057] dark:text-[#ADB5BD] pl-0.5" htmlFor="signupEmail">
              이메일
            </label>
            <input
              className="w-full h-[50px] px-4 rounded-xl border border-[#E9ECEF] dark:border-[#2C3036] bg-white dark:bg-[#1E2125] text-[14.5px] text-[#212529] dark:text-[#F1F3F5] placeholder-[#868E96] focus:outline-none focus:border-[#1EA65C] focus:ring-1 focus:ring-[#1EA65C] transition-colors"
              id="signupEmail"
              placeholder="example@tasko.app"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 항목 2: 비밀번호 */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#495057] dark:text-[#ADB5BD] pl-0.5" htmlFor="signupPassword">
              비밀번호
            </label>
            <input
              className="w-full h-[50px] px-4 rounded-xl border border-[#E9ECEF] dark:border-[#2C3036] bg-white dark:bg-[#1E2125] text-[14.5px] text-[#212529] dark:text-[#F1F3F5] placeholder-[#868E96] focus:outline-none focus:border-[#1EA65C] focus:ring-1 focus:ring-[#1EA65C] transition-colors"
              id="signupPassword"
              placeholder="비밀번호를 입력하세요"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 항목 3: 비밀번호 확인 */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#495057] dark:text-[#ADB5BD] pl-0.5" htmlFor="passwordConfirm">
              비밀번호 확인
            </label>
            <input
              className="w-full h-[50px] px-4 rounded-xl border border-[#E9ECEF] dark:border-[#2C3036] bg-white dark:bg-[#1E2125] text-[14.5px] text-[#212529] dark:text-[#F1F3F5] placeholder-[#868E96] focus:outline-none focus:border-[#1EA65C] focus:ring-1 focus:ring-[#1EA65C] transition-colors"
              id="passwordConfirm"
              placeholder="비밀번호를 한 번 더 입력하세요"
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          {/* 에러 문구 / 안내 문구: 있을 때만 보인다 */}
          {errorMessage && (
            <p role="alert" className="text-xs font-medium text-[#FA5252] dark:text-[#FF6B6B]">
              {errorMessage}
            </p>
          )}
          {noticeMessage && (
            <p role="status" className="text-xs font-medium text-[#1EA65C]">
              {noticeMessage}
            </p>
          )}

          {/* 회원가입 버튼 */}
          <div className="pt-2">
            <button
              className="w-full h-[50px] bg-[#1EA65C] hover:bg-[#178449] active:scale-[0.99] text-white font-medium text-[15px] rounded-xl shadow-[0_4px_14px_rgba(30,166,92,0.25)] transition-all flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {buttonLabel}
            </button>
          </div>
        </form>
      </section>

      {/* 하단 로그인 전환 링크 */}
      <footer className="pb-8 flex flex-col items-center shrink-0">
        <p className="text-[13px] text-[#495057] dark:text-[#ADB5BD] font-normal tracking-tight">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-[#1EA65C] font-semibold hover:underline ml-1">
            로그인
          </Link>
        </p>
      </footer>
    </div>
  );
}

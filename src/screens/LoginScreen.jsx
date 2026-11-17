import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

/**
 * Supabase 로그인 에러를 한국어 문구로 바꾼다
 */
function getLoginErrorMessage(error) {
  const code = error.code;
  const message = error.message || '';

  if (code === 'invalid_credentials' || message.includes('Invalid login credentials')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.';
  }
  if (code === 'email_not_confirmed' || message.includes('Email not confirmed')) {
    return '이메일 인증이 필요합니다. 메일함을 확인해 주세요.';
  }
  if (code === 'over_request_rate_limit' || message.includes('rate limit')) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
  }
  if (message.includes('Failed to fetch')) {
    return '인터넷 연결을 확인해 주세요.';
  }
  return '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.';
}

/**
 * Tasko 모바일 로그인 화면
 * - 앱 첫 화면으로 사용됩니다.
 * - 이메일·비밀번호로 Supabase에 로그인하고, 성공하면 대시보드(/dashboard)로 이동합니다.
 * - 실패하면 폼 아래에 한국어 에러 문구를 보여 줍니다.
 */
export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 버튼 처리
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    // 연결값(.env.local)이 없으면 로그인할 수 없다
    if (!supabase) {
      setErrorMessage('서버 연결 설정이 없습니다. 관리자에게 문의해 주세요.');
      return;
    }

    setIsLoading(true);
    const result = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    setIsLoading(false);

    if (result.error) {
      setErrorMessage(getLoginErrorMessage(result.error));
      return;
    }

    // 로그인 성공: 대시보드로 이동
    navigate('/dashboard');
  }

  // 요청 중에는 버튼 글자를 바꾼다
  let buttonLabel = '로그인';
  if (isLoading) {
    buttonLabel = '로그인 중...';
  }

  return (
    <div className="w-full h-full bg-[#F8F9FA] dark:bg-[#121417] flex flex-col justify-between select-none">
      {/* 상단 헤더: 앱 상태 및 연결 상태 */}
      <header className="w-full pt-4 px-6 flex justify-between items-center z-10 shrink-0">
        <div className="text-xs font-semibold text-[#868E96] tracking-tight">Tasko Mobile</div>
        <div className="flex items-center space-x-1.5 text-xs text-[#868E96]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#1EA65C]"></span>
          <span>Online</span>
        </div>
      </header>

      {/* 중앙 메인 컨텐츠: 브랜드 로고 및 로그인 폼 */}
      <section className="flex-1 px-6 flex flex-col justify-center -mt-6">
        {/* 브랜드 아이콘 & 로고 & 안내 문구 */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#1EA65C] flex items-center justify-center shadow-md shadow-[#1EA65C]/20">
              <svg className="w-5 h-5 text-white stroke-[2.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span className="text-3xl font-extrabold text-[#212529] dark:text-[#F1F3F5] tracking-tight">할일관리(tasko)</span>
          </div>
          <p className="text-sm font-medium text-[#495057] dark:text-[#ADB5BD]">
            오늘 할 일을 이어서 관리해 보세요
          </p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 입력창 */}
          <div className="space-y-1.5">
            <label htmlFor="loginEmail" className="block text-xs font-semibold text-[#495057] dark:text-[#ADB5BD]">
              이메일
            </label>
            <input
              type="email"
              id="loginEmail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@tasko.app"
              className="w-full h-12 px-4 bg-white dark:bg-[#1E2125] border border-[#E9ECEF] dark:border-[#2C3036] rounded-xl text-sm text-[#212529] dark:text-[#F1F3F5] font-normal placeholder-[#868E96] focus:outline-none focus:border-[#1EA65C] focus:ring-2 focus:ring-[#1EA65C]/15 transition-all"
            />
          </div>

          {/* 비밀번호 입력창 */}
          <div className="space-y-1.5">
            <label htmlFor="loginPassword" className="block text-xs font-semibold text-[#495057] dark:text-[#ADB5BD]">
              비밀번호
            </label>
            <input
              type="password"
              id="loginPassword"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full h-12 px-4 bg-white dark:bg-[#1E2125] border border-[#E9ECEF] dark:border-[#2C3036] rounded-xl text-sm text-[#212529] dark:text-[#F1F3F5] font-normal placeholder-[#868E96] focus:outline-none focus:border-[#1EA65C] focus:ring-2 focus:ring-[#1EA65C]/15 transition-all"
            />
          </div>

          {/* 에러 문구: 에러가 있을 때만 보인다 */}
          {errorMessage && (
            <p role="alert" className="text-xs font-medium text-[#FA5252] dark:text-[#FF6B6B]">
              {errorMessage}
            </p>
          )}

          {/* 로그인 버튼: 에메랄드 그린 풀사이즈 버튼 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#1EA65C] hover:bg-[#178449] active:scale-[0.98] text-white text-base font-semibold rounded-xl shadow-md shadow-[#1EA65C]/25 transition-all duration-150 flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {buttonLabel}
            </button>
          </div>
        </form>
      </section>

      {/* 하단 회원가입 전환 링크 */}
      <footer className="w-full pb-8 px-6 text-center shrink-0">
        <div className="text-sm text-[#495057] dark:text-[#ADB5BD]">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="font-bold text-[#1EA65C] hover:underline ml-1">
            회원가입
          </Link>
        </div>
      </footer>
    </div>
  );
}

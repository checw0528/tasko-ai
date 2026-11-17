import React from 'react';
import { useTheme } from '../context/useTheme.js';

/**
 * 라이트/다크 모드 전환 버튼 (해/달 모양)
 * - 라이트일 때는 달 아이콘(누르면 다크), 다크일 때는 해 아이콘(누르면 라이트)
 * - 크기와 모양은 헤더의 검색 버튼과 같다
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // 버튼 설명 글자 (화면 읽기 프로그램용)
  let label = '다크 모드로 바꾸기';
  if (isDark) {
    label = '라이트 모드로 바꾸기';
  }

  // 다크 모드 → 해 아이콘
  const sunIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="12" y1="2" x2="12" y2="4"></line>
      <line x1="12" y1="20" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="4" y2="12"></line>
      <line x1="20" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
    </svg>
  );

  // 라이트 모드 → 달 아이콘
  const moonIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );

  let icon = moonIcon;
  if (isDark) {
    icon = sunIcon;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] dark:hover:bg-[#121417] text-[#495057] dark:text-[#ADB5BD] active:scale-95 transition-all cursor-pointer"
    >
      {icon}
    </button>
  );
}

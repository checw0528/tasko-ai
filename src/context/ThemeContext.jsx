import React, { useState, useEffect } from 'react';
import { ThemeContext } from './useTheme.js';

// 브라우저(localStorage)에 모드를 저장할 때 쓰는 이름
const STORAGE_KEY = 'tasko-theme';

/**
 * 처음 화면을 열 때 쓸 모드를 정한다.
 * 1) 저장된 값('light' 또는 'dark')이 있으면 그 값을 쓴다.
 * 2) 없으면 기기 설정(시스템 다크 모드)을 따른다.
 */
function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    return 'dark';
  }
  return 'light';
}

/**
 * 라이트/다크 모드 상태를 앱 전체에 공유하는 Provider
 * - 모드가 바뀌면 <html>에 dark 클래스를 켜고 끈다 (Tailwind의 dark: 가 이 클래스를 본다)
 * - 고른 모드는 localStorage에 저장해 새로고침해도 유지한다
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // 모드가 바뀔 때마다 <html> 클래스를 맞춘다
  useEffect(
    function applyThemeClass() {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    },
    [theme]
  );

  // 해/달 버튼을 누르면 호출: 모드를 바꾸고 저장한다
  function toggleTheme() {
    let nextTheme = 'dark';
    if (theme === 'dark') {
      nextTheme = 'light';
    }
    setTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  const value = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

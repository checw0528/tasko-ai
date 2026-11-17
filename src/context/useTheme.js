import { createContext, useContext } from 'react';

// 라이트/다크 모드 공유를 위한 React Context (ThemeProvider와 useTheme이 함께 쓴다)
export const ThemeContext = createContext(null);

// 편의를 위한 Custom Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

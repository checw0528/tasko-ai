import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // 검사하지 않을 폴더
  globalIgnores(['dist', '.playwright-mcp']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended, // ESLint 기본 추천 규칙
      reactHooks.configs.flat.recommended, // React Hooks 규칙
      reactRefresh.configs.vite, // Vite 빠른 새로고침 규칙
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true }, // JSX 문법 허용
        sourceType: 'module',
      },
    },
    rules: {
      // 대문자/언더스코어로 시작하는 변수와 motion은 안 쓰여도 허용
      // (motion.svg 같은 JSX 사용을 ESLint가 사용으로 인식하지 못하기 때문)
      'no-unused-vars': ['error', { varsIgnorePattern: '^(motion$|[A-Z_])' }],
    },
  },
  {
    // vite.config.js는 브라우저가 아니라 Node에서 실행되므로 Node 전역(process 등)을 허용
    files: ['vite.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);

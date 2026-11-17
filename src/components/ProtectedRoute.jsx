import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

/**
 * 로그인한 사람만 안쪽 화면을 보여 주는 부품
 * - 로그인 상태를 확인하는 동안: 배경색만 보여 준다 (다크 모드에서도 흰 화면이 번쩍이지 않게)
 * - 로그인이 안 되어 있으면: 로그인 화면(/login)으로 보낸다
 * - 다른 곳에서 로그아웃해도 상태 변화를 계속 지켜보다가 바로 로그인 화면으로 보낸다
 */
export default function ProtectedRoute({ children }) {
  // 'loading'(확인 중) | 'in'(로그인됨) | 'out'(로그인 안 됨)
  // Supabase 연결값이 없으면 확인할 방법이 없으므로 처음부터 'out'으로 시작한다
  const [status, setStatus] = useState(function getFirstStatus() {
    if (!supabase) {
      return 'out';
    }
    return 'loading';
  });

  useEffect(function watchSession() {
    if (!supabase) {
      return undefined;
    }

    // 로그인 상태가 바뀔 때마다 알려 준다 (처음 한 번은 지금 상태를 알려 준다)
    const listener = supabase.auth.onAuthStateChange(function handleChange(event, session) {
      if (session) {
        setStatus('in');
      } else {
        setStatus('out');
      }
    });

    // 화면이 사라질 때 지켜보기를 멈춘다
    return function stopWatching() {
      listener.data.subscription.unsubscribe();
    };
  }, []);

  if (status === 'loading') {
    return <div className="w-full h-full bg-[#F8F9FA] dark:bg-[#121417]"></div>;
  }

  if (status === 'out') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

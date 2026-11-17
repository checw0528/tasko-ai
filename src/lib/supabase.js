import { createClient } from '@supabase/supabase-js';

// .env.local에 넣어 둔 Supabase 주소와 공개(publishable) 키
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 앱 전체에서 하나만 만들어 같이 쓰는 Supabase 연결
let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  // 값이 비어 있으면 연결을 만들지 않고 콘솔에 알려 준다
  console.error(
    'Supabase 환경변수가 비어 있습니다. .env.local의 VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY를 확인하세요. (값을 고친 뒤에는 개발 서버를 다시 켜야 합니다)'
  );
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };

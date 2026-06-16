import {createClient} from '@supabase/supabase-js';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';

// Supabase 설정
const SUPABASE_URL = Config.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = Config.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ Supabase URL 또는 Anon Key가 설정되지 않았습니다. .env 파일을 확인하세요.',
  );
}

// EncryptedStorage를 Supabase Auth storage로 사용
// getItem/setItem/removeItem에서 예외가 나면 GoTrueClient·autoRefresh가 실패하므로 모두 try-catch 처리
const customStorage = {
  getItem: async (key: string) => {
    try {
      return await EncryptedStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch {
      // Keychain 오류 시 무시 (세션 저장 실패해도 앱이 죽지 않도록)
    }
  },
  removeItem: async (key: string) => {
    try {
      await EncryptedStorage.removeItem(key);
    } catch {
      // 키 없음 또는 Keychain 오류 시 무시 (세션 정리·auto refresh 실패 방지)
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

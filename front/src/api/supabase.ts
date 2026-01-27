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
const customStorage = {
  getItem: async (key: string) => {
    return await EncryptedStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    await EncryptedStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    await EncryptedStorage.removeItem(key);
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

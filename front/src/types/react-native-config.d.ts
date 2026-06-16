declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_MAP_API_KEY?: string;
    GOOGLE_IOS_CLIENT_ID?: string;
    GOOGLE_CLIENT_ID?: string;
    KAKAO_REST_API_KEY?: string;
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}

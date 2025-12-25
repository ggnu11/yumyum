declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_MAP_API_KEY?: string;
    KAKAO_REST_API_KEY?: string;
    KAKAO_REDIRECT_URI?: string;
    NAVER_CLIENT_ID?: string;
    NAVER_CLIENT_SECRET?: string;
    NAVER_URL_SCHEME?: string;
    API_BASE_URL?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}

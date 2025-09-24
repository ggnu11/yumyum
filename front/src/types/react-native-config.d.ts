declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_MAP_API_KEY?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_IOS_CLIENT_ID?: string;
    GOOGLE_IOS_REVERSED_CLIENT_ID?: string;
    KAKAO_REST_API_KEY?: string;
    NAVER_APP_NAME?: string;
    NAVER_CLIENT_ID?: string;
    NAVER_CLIENT_SECRET?: string;
    NAVER_URL_SCHEME?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}

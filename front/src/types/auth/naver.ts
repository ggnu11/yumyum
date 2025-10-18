/**
 * 네이버 로그인 관련 타입 정의
 * 네이버 정책에 따른 프로필 및 로그인 응답 타입
 */

export interface NaverProfile {
  id: string;
  email?: string | null; // 선택 동의 항목
  nickname?: string;
  profileImage?: string;
}

export interface NaverLoginResult {
  token: string;
  profile: NaverProfile;
}

export interface NaverLoginConfig {
  appName: string;
  consumerKey: string;
  consumerSecret: string;
  serviceUrlSchemeIOS?: string;
}

export interface NaverSignInState {
  isLoggedIn: boolean;
  isInitialized: boolean;
}

export interface NaverSignInActions {
  initializeNaverLogin: () => Promise<void>;
  checkLoginState: () => Promise<boolean>;
  performLogin: () => Promise<NaverLoginResult>;
  tryAutoLogin: () => Promise<NaverLoginResult | null>;
  logout: () => Promise<void>;
  deleteToken: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  refreshToken: () => Promise<string | null>;
  getProfile: () => Promise<NaverProfile | null>;
}

import Config from 'react-native-config';
import {NaverLoginConfig} from '../../../types/auth/naver';

/**
 * 네이버 로그인 설정
 * 플랫폼별 Consumer Key/Secret 관리
 */
export const getNaverLoginConfig = (): NaverLoginConfig => {
  return {
    appName: Config.NAVER_APP_NAME as string,
    consumerKey: Config.NAVER_CLIENT_ID as string,
    consumerSecret: Config.NAVER_CLIENT_SECRET as string,
    serviceUrlSchemeIOS: Config.NAVER_URL_SCHEME as string, // iOS URL Scheme
  };
};

/**
 * 네이버 로그인 초기화 검증
 */
export const validateNaverConfig = (config: NaverLoginConfig): boolean => {
  return !!(config.consumerKey && config.consumerSecret && config.appName);
};

/**
 * 네이버 프로필 응답 성공 여부 확인
 */
export const isNaverProfileSuccess = (resultcode: string): boolean => {
  return resultcode === '00';
};

/**
 * 사용자 취소 에러인지 확인
 */
export const isUserCancelledError = (error: any): boolean => {
  return (
    error.message?.includes('cancelled') ||
    error.message?.includes('취소') ||
    error.message?.includes('cancel')
  );
};

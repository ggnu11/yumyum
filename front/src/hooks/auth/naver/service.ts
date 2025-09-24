import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';
import {NaverProfile, NaverLoginResult} from '../../../types/auth/naver';
import {
  getNaverLoginConfig,
  validateNaverConfig,
  isNaverProfileSuccess,
  isUserCancelledError,
} from './config';

/**
 * 네이버 로그인 서비스 클래스
 * 네이버 SDK와의 상호작용을 담당
 */
export class NaverLoginService {
  private isInitialized = false;

  /**
   * 네이버 로그인 초기화
   */
  async initialize(): Promise<void> {
    try {
      const config = getNaverLoginConfig();

      if (!validateNaverConfig(config)) {
        throw new Error('네이버 로그인 설정이 올바르지 않습니다.');
      }

      NaverLogin.initialize(config);
      this.isInitialized = true;
    } catch (error) {
      this.isInitialized = false;
      throw error;
    }
  }

  /**
   * 초기화 상태 확인
   */
  getInitializationState(): boolean {
    return this.isInitialized;
  }

  /**
   * 네이버 로그인 실행
   */
  async login(): Promise<NaverLoginResult> {
    if (!this.isInitialized) {
      throw new Error('네이버 로그인이 초기화되지 않았습니다.');
    }

    try {
      const loginResult: NaverLoginResponse = await NaverLogin.login();

      if (loginResult.isSuccess && loginResult.successResponse) {
        const {accessToken} = loginResult.successResponse;
        const profile = await this.getProfileWithToken(accessToken);

        return {
          token: accessToken,
          profile,
        };
      } else {
        const errorMessage =
          loginResult.failureResponse?.message || '로그인에 실패했습니다.';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      // 사용자 취소는 별도 처리
      if (isUserCancelledError(error)) {
        throw new Error('CANCELLED');
      }

      throw new Error(error.message || '네이버 로그인에 실패했습니다.');
    }
  }

  /**
   * 토큰으로 프로필 정보 가져오기
   */
  async getProfileWithToken(token: string): Promise<NaverProfile> {
    try {
      const profileResult: GetProfileResponse = await NaverLogin.getProfile(
        token,
      );

      if (
        isNaverProfileSuccess(profileResult.resultcode) &&
        profileResult.response
      ) {
        const profile = profileResult.response;

        return {
          id: profile.id,
          email: profile.email || null, // 선택 동의 항목
          nickname: profile.nickname || undefined,
          profileImage: profile.profile_image || undefined,
        };
      } else {
        throw new Error('프로필 정보를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    try {
      await NaverLogin.logout();
    } catch (error) {
      throw error;
    }
  }

  /**
   * 토큰 삭제 (완전 로그아웃)
   */
  async deleteToken(): Promise<void> {
    try {
      await NaverLogin.deleteToken();
    } catch (error) {
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const naverLoginService = new NaverLoginService();

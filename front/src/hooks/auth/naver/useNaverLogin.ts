import {useCallback, useEffect, useState} from 'react';
import {
  NaverSignInState,
  NaverSignInActions,
  NaverProfile,
  NaverLoginResult,
} from '../../../types/auth/naver';
import {naverLoginService} from './service';

/**
 * 네이버 로그인 상태 관리 훅
 * 네이버 정책에 따른 세션 관리 및 자동 갱신 기능 제공
 */
export function useNaverLogin(): NaverSignInState & NaverSignInActions {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  /**
   * 네이버 로그인 초기 설정
   */
  const initializeNaverLogin = useCallback(async () => {
    try {
      await naverLoginService.initialize();
      setIsInitialized(true);
    } catch (error) {
      setIsInitialized(false);
    }
  }, []);

  /**
   * 네이버 로그인 상태 확인
   */
  const checkLoginState = useCallback(async () => {
    try {
      const loggedIn = !!accessToken;
      setIsLoggedIn(loggedIn);
      return loggedIn;
    } catch (error) {
      setIsLoggedIn(false);
      return false;
    }
  }, [accessToken]);

  /**
   * 네이버 로그인 수행
   */
  const performLogin = useCallback(async (): Promise<NaverLoginResult> => {
    try {
      const result = await naverLoginService.login();
      setAccessToken(result.token);
      setIsLoggedIn(true);
      return result;
    } catch (error) {
      setIsLoggedIn(false);
      setAccessToken(null);
      throw error;
    }
  }, []);

  /**
   * 자동 로그인 시도 (세션 복원)
   */
  const tryAutoLogin =
    useCallback(async (): Promise<NaverLoginResult | null> => {
      try {
        if (accessToken) {
          // 토큰이 유효한지 확인하기 위해 프로필 요청
          const profile = await naverLoginService.getProfileWithToken(
            accessToken,
          );
          setIsLoggedIn(true);

          return {
            token: accessToken,
            profile,
          };
        }

        return null;
      } catch (error) {
        setIsLoggedIn(false);
        setAccessToken(null);
        return null;
      }
    }, [accessToken]);

  /**
   * 네이버 로그아웃
   */
  const logout = useCallback(async () => {
    try {
      await naverLoginService.logout();
      setIsLoggedIn(false);
      setAccessToken(null);
    } catch (error) {
      //
    }
  }, []);

  /**
   * 토큰 삭제 (완전 로그아웃)
   */
  const deleteToken = useCallback(async () => {
    try {
      await naverLoginService.deleteToken();
      setIsLoggedIn(false);
      setAccessToken(null);
    } catch (error) {
      //
    }
  }, []);

  /**
   * 현재 액세스 토큰 가져오기
   */
  const getAccessToken = useCallback(async () => {
    return accessToken;
  }, [accessToken]);

  /**
   * 토큰 갱신 (네이버 SDK에서 자동으로 처리됨)
   */
  const refreshToken = useCallback(async () => {
    try {
      // 네이버 SDK는 토큰을 자동으로 갱신합니다.
      return accessToken;
    } catch (error) {
      return null;
    }
  }, [accessToken]);

  /**
   * 프로필 정보 가져오기
   */
  const getProfile = useCallback(async (): Promise<NaverProfile | null> => {
    try {
      if (!accessToken) return null;
      return await naverLoginService.getProfileWithToken(accessToken);
    } catch (error) {
      return null;
    }
  }, [accessToken]);

  /**
   * 초기화
   */
  useEffect(() => {
    const initialize = async () => {
      await initializeNaverLogin();
      await checkLoginState();
    };

    initialize();
  }, [initializeNaverLogin, checkLoginState]);

  return {
    isLoggedIn,
    isInitialized,
    initializeNaverLogin,
    checkLoginState,
    performLogin,
    tryAutoLogin,
    logout,
    deleteToken,
    getAccessToken,
    refreshToken,
    getProfile,
  };
}

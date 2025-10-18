import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useCallback, useEffect, useState} from 'react';
import Config from 'react-native-config';

/**
 * Google Sign In 상태를 관리하고 재로그인 처리를 담당하는 훅
 * Google 정책에 따른 세션 관리 및 자동 갱신 기능 제공
 */
export function useGoogleSignInState() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  /**
   * Google Sign In 초기 설정
   * webClientId는 환경 설정에서 가져와야 함
   */
  const configureGoogleSignIn = useCallback(async () => {
    try {
      await GoogleSignin.configure({
        iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
        webClientId: Config.GOOGLE_CLIENT_ID,
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });
      setIsConfigured(true);
    } catch (error) {
      setIsConfigured(false);
    }
  }, []);

  /**
   * Google Sign In 가용성 및 현재 로그인 상태 확인
   */
  const checkSignInState = useCallback(async () => {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (!hasPlayServices) {
        throw new Error('Google Play Services가 필요합니다.');
      }

      const currentUser = await GoogleSignin.getCurrentUser();
      const signedIn = currentUser !== null;
      setIsSignedIn(signedIn);
      return signedIn;
    } catch (error) {
      setIsSignedIn(false);
      return false;
    }
  }, []);

  /**
   * Google Sign In 수행
   * 정책에 따라 프로필, 이메일 정보 요청
   */
  const performSignIn = useCallback(async () => {
    if (!isConfigured) {
      throw new Error('Google Sign-In이 설정되지 않았습니다.');
    }

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      setIsSignedIn(true);

      return {
        idToken: userInfo.data?.idToken || null,
        user: {
          id: userInfo.data?.user?.id || '',
          email: userInfo.data?.user?.email || '',
          name: userInfo.data?.user?.name || '',
          photo: userInfo.data?.user?.photo || '',
        },
      };
    } catch (error: any) {
      setIsSignedIn(false);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('로그인이 이미 진행 중입니다.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services가 필요합니다.');
      } else {
        throw new Error('Google 로그인에 실패했습니다.');
      }
    }
  }, [isConfigured]);

  /**
   * 자동 로그인 시도 (세션 복원)
   */
  const tryAutoSignIn = useCallback(async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setIsSignedIn(true);

      return {
        idToken: userInfo.data?.idToken || null,
        user: {
          id: userInfo.data?.user?.id || '',
          email: userInfo.data?.user?.email || '',
          name: userInfo.data?.user?.name || '',
          photo: userInfo.data?.user?.photo || '',
        },
      };
    } catch (error: any) {
      setIsSignedIn(false);

      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // 자동 로그인 불가 - 정상적인 상황
        return null;
      } else {
        return null;
      }
    }
  }, []);

  /**
   * Google Sign Out
   */
  const signOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      setIsSignedIn(false);
    } catch (error) {
      //
    }
  }, []);

  /**
   * Google 계정 연결 완전 해제 (탈퇴 시 사용)
   */
  const revokeAccess = useCallback(async () => {
    try {
      await GoogleSignin.revokeAccess();
      setIsSignedIn(false);
    } catch (error) {
      //
    }
  }, []);

  /**
   * 현재 로그인된 사용자 정보 가져오기
   */
  const getCurrentUser = useCallback(async () => {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      return userInfo || null;
    } catch (error) {
      return null;
    }
  }, []);

  /**
   * 액세스 토큰 가져오기 (토큰 갱신 포함)
   */
  const getTokens = useCallback(async () => {
    try {
      const tokens = await GoogleSignin.getTokens();
      return tokens;
    } catch (error) {
      return null;
    }
  }, []);

  /**
   * 초기화
   */
  useEffect(() => {
    const initialize = async () => {
      await configureGoogleSignIn();
      await checkSignInState();
    };

    initialize();
  }, [configureGoogleSignIn, checkSignInState]);

  return {
    isSignedIn,
    isConfigured,
    configureGoogleSignIn,
    checkSignInState,
    performSignIn,
    tryAutoSignIn,
    signOut,
    revokeAccess,
    getCurrentUser,
    getTokens,
  };
}

export default useGoogleSignInState;

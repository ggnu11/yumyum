import appleAuth, {
  AppleRequestScope,
  AppleCredentialState,
} from '@invertase/react-native-apple-authentication';
import {useEffect, useState, useCallback} from 'react';
import {Platform} from 'react-native';

export function useAppleSignInState() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [credentialState, setCredentialState] =
    useState<AppleCredentialState | null>(null);

  const checkAvailability = useCallback(async () => {
    if (Platform.OS !== 'ios') {
      setIsAvailable(false);
      return;
    }

    try {
      const available = appleAuth.isSupported;
      setIsAvailable(available);
    } catch (error) {
      console.error('Apple Sign In 가용성 확인 실패:', error);
      setIsAvailable(false);
    }
  }, []);

  /**
   * 특정 사용자 ID의 Apple 계정 상태 확인
   * @param userId Apple에서 제공하는 사용자 고유 식별자 (sub)
   */
  const checkCredentialState = useCallback(
    async (userId: string) => {
      if (!isAvailable) return null;

      try {
        const state = await appleAuth.getCredentialStateForUser(userId);
        setCredentialState(state);
        return state;
      } catch (error) {
        console.error('Apple 계정 상태 확인 실패:', error);
        return null;
      }
    },
    [isAvailable],
  );

  /**
   * Apple Sign In 재로그인 수행
   * 기존 사용자의 경우 정보 요청 없이 간편 로그인
   */
  const performReSignIn = useCallback(async () => {
    if (!isAvailable) {
      throw new Error('Apple Sign In이 지원되지 않는 기기입니다.');
    }

    try {
      // 재로그인 시에는 정보 요청 범위를 제한하지 않음
      // Apple이 자동으로 이전에 동의한 범위만 사용
      const {identityToken, email, fullName} = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [AppleRequestScope.EMAIL, AppleRequestScope.FULL_NAME],
      });

      return {
        identityToken,
        email,
        fullName,
      };
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        throw new Error('CANCELED');
      }
      throw error;
    }
  }, [isAvailable]);

  /**
   * Apple Sign In 상태 변화 감지
   */
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    let credentialStateChangeListener: any;

    const setupListener = async () => {
      try {
        await checkAvailability();

        credentialStateChangeListener = appleAuth.onCredentialRevoked(
          async () => {
            console.warn('Apple 계정 연결이 해제되었습니다.');
            setCredentialState(AppleCredentialState.REVOKED);
            // 여기서 로그아웃 처리나 사용자에게 알림을 보낼 수 있음
          },
        );
      } catch (error) {
        console.error('Apple Sign In 리스너 설정 실패:', error);
      }
    };

    setupListener();

    return () => {
      if (credentialStateChangeListener) {
        credentialStateChangeListener();
      }
    };
  }, [checkAvailability]);

  const getCredentialStateMessage = useCallback(
    (state: AppleCredentialState) => {
      switch (state) {
        case AppleCredentialState.AUTHORIZED:
          return '인증된 상태입니다.';
        case AppleCredentialState.REVOKED:
          return 'Apple 계정 연결이 해제되었습니다. 다시 로그인해주세요.';
        case AppleCredentialState.NOT_FOUND:
          return '이전 로그인 기록이 없습니다.';
        case AppleCredentialState.TRANSFERRED:
          return '계정이 다른 시스템으로 이전되었습니다.';
        default:
          return '알 수 없는 상태입니다.';
      }
    },
    [],
  );

  return {
    isAvailable,
    credentialState,
    checkAvailability,
    checkCredentialState,
    performReSignIn,
    getCredentialStateMessage,
  };
}

export default useAppleSignInState;

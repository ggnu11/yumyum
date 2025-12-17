import RetryErrorBoundary from '@/components/common/RetryErrorBoundary';
import useAuth from '@/hooks/queries/useAuth';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import BottomTabNavigation from './BottomTabNavigation';

function RootNavigation() {
  const {isLogin, auth} = useAuth();

  // 로그인은 했지만 닉네임이 없는 경우 (첫 계정) - AuthNavigation에서 처리
  // AuthNavigation 내부에서 ProfileRegistration 화면으로 자동 이동하도록 구현

  return (
    <RetryErrorBoundary>
      <NavigationContainer>
        {isLogin && auth.nickname ? (
          <BottomTabNavigation />
        ) : (
          <AuthNavigation />
        )}
      </NavigationContainer>
    </RetryErrorBoundary>
  );
}

export default RootNavigation;

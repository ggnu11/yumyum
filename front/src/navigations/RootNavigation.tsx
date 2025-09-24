import RetryErrorBoundary from '@/components/common/RetryErrorBoundary';
import useAuth from '@/hooks/queries/useAuth';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import BottomTabNavigation from './BottomTabNavigation';

function RootNavigation() {
  const {isLogin} = useAuth();

  return (
    <RetryErrorBoundary>
      <NavigationContainer>
        {isLogin ? <BottomTabNavigation /> : <AuthNavigation />}
      </NavigationContainer>
    </RetryErrorBoundary>
  );
}

export default RootNavigation;

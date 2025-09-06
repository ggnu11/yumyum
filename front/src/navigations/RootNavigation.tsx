import RetryErrorBoundary from '@/components/common/RetryErrorBoundary';
import useAuth from '@/hooks/queries/useAuth';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import DrawerNavigation from './DrawerNavigation';

function RootNavigation() {
  const {isLogin} = useAuth();

  return (
    <RetryErrorBoundary>
      <NavigationContainer>
        {isLogin ? <DrawerNavigation /> : <AuthNavigation />}
      </NavigationContainer>
    </RetryErrorBoundary>
  );
}

export default RootNavigation;

import {createStackNavigator} from '@react-navigation/stack';

import {colors} from '@/constants/colors';
import AuthHomeScreen from '@/screens/auth/AuthHomeScreen';
import KakaoLoginScreen from '@/screens/auth/KakaoLoginScreen';
import NaverLoginScreen from '@/screens/auth/NaverLoginScreen';
import useThemeStore from '@/store/theme';

const Stack = createStackNavigator();

function AuthNavigation() {
  const {theme} = useThemeStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackButtonDisplayMode: 'minimal',

        headerTintColor: colors[theme].BLACK,
        headerStyle: {
          backgroundColor: colors[theme].WHITE,

          shadowColor: colors[theme].GRAY_500,
        },
        headerTitleStyle: {
          fontSize: 16,
        },
        cardStyle: {
          backgroundColor: colors[theme].WHITE,
        },
      }}>
      <Stack.Screen
        name="AuthHome"
        component={AuthHomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="KakaoLogin"
        component={KakaoLoginScreen}
        options={{title: '카카오 로그인'}}
      />
      <Stack.Screen
        name="NaverLogin"
        component={NaverLoginScreen}
        options={{title: '네이버 로그인'}}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigation;

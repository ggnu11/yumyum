import {createStackNavigator} from '@react-navigation/stack';

import {colors} from '@/constants/colors';
import AuthHomeScreen from '@/screens/auth/AuthHomeScreen';
import KakaoLoginScreen from '@/screens/auth/KakaoLoginScreen';
import TermsAgreementScreen from '@/screens/auth/TermsAgreementScreen';
import TermsDetailScreen from '@/screens/auth/TermsDetailScreen';
import useThemeStore from '@/store/theme';
import NaverLoginScreen from '@/screens/auth/NaverLoginScreen';

const Stack = createStackNavigator();

function AuthNavigation() {
  const {theme} = useThemeStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackButtonDisplayMode: 'minimal',

        headerTintColor: colors[theme][100],
        headerStyle: {
          backgroundColor: colors[theme][0],

          shadowColor: colors[theme].GRAY_500,
        },
        headerTitleStyle: {
          fontSize: 16,
        },
        cardStyle: {
          backgroundColor: colors[theme][0],
        },
      }}>
      <Stack.Screen
        name="AuthHome"
        component={AuthHomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TermsAgreement"
        component={TermsAgreementScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TermsDetail"
        component={TermsDetailScreen}
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

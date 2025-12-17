import {createStackNavigator} from '@react-navigation/stack';
import {useEffect} from 'react';

import {colors} from '@/constants/colors';
import AuthHomeScreen from '@/screens/auth/AuthHomeScreen';
import KakaoLoginScreen from '@/screens/auth/KakaoLoginScreen';
import TermsAgreementScreen from '@/screens/auth/TermsAgreementScreen';
import TermsDetailScreen from '@/screens/auth/TermsDetailScreen';
import ProfileRegistrationScreen from '@/screens/auth/ProfileRegistrationScreen';
import useThemeStore from '@/store/theme';
import NaverLoginScreen from '@/screens/auth/NaverLoginScreen';
import useAuth from '@/hooks/queries/useAuth';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '@/types/navigation';

const Stack = createStackNavigator<AuthStackParamList>();

type Navigation = StackNavigationProp<AuthStackParamList>;

function AuthNavigation() {
  const {theme} = useThemeStore();
  const {isLogin, auth} = useAuth();

  // 로그인 상태에 따른 초기 라우트 결정
  // 1. 로그인했지만 닉네임이 없으면 약관 동의 화면 (신규 유저)
  // 2. 그 외에는 AuthHome
  const getInitialRoute = () => {
    if (isLogin && !auth.nickname) {
      // 신규 유저는 약관 동의 화면으로 먼저 이동
      return 'TermsAgreement';
    }
    return 'AuthHome';
  };

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
      }}
      initialRouteName={getInitialRoute()}>
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
      <Stack.Screen
        name="ProfileRegistration"
        component={ProfileRegistrationScreen}
        options={{
          title: '프로필 등록',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigation;

import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import NaverLogin from '@react-native-seoul/naver-login';
import Config from 'react-native-config';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

import Indicator from '@/components/common/Indicator';
import useAuth from '@/hooks/queries/useAuth';

const naverLoginConfig = {
  consumerKey: Config.NAVER_CLIENT_ID || 'YeN8k9nwVtaOYNEJjGS6', // 네이버 개발자 센터에서 발급받은 Client ID
  consumerSecret: Config.NAVER_CLIENT_SECRET || 'MPG7yEynQD', // 네이버 개발자 센터에서 발급받은 Client Secret
  appName: 'yumyum',
  serviceUrlScheme: 'com.yumyum-app.naver',
  serviceAppUrlScheme: 'com.yumyum-app.naver',
};

function NaverLoginScreen() {
  const {naverLoginMutation} = useAuth();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    // 네이버 로그인 초기화
    NaverLogin.initialize({
      ...naverLoginConfig,
      disableNaverAppAuthIOS: true,
      serviceUrlSchemeIOS: 'com.yumyum-app.naver',
    });

    // 자동으로 네이버 로그인 시작
    handleNaverLogin();
  }, []);

  const handleNaverLogin = async () => {
    try {
      setIsLoading(true);

      // 네이버 로그인 실행
      const result = await NaverLogin.login();

      if (result.isSuccess && result.successResponse?.accessToken) {
        naverLoginMutation.mutate(result.successResponse.accessToken, {
          onSuccess: () => {
            setIsLoading(false);
            Toast.show({
              type: 'success',
              text1: '네이버 로그인 성공',
              text2: '환영합니다!',
            });
            setTimeout(() => {
              navigation.goBack();
            }, 1000);
          },
          onError: (error: any) => {
            setIsLoading(false);
            Toast.show({
              type: 'error',
              text1: '네이버 로그인이 실패했습니다.',
              text2:
                error.response?.data?.message || '나중에 다시 시도해주세요',
            });
            navigation.goBack();
          },
        });
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: '네이버 로그인이 취소되었습니다.',
        });
        navigation.goBack();
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('네이버 로그인 오류:', error);
      Toast.show({
        type: 'error',
        text1: '네이버 로그인이 실패했습니다.',
        text2: '나중에 다시 시도해주세요',
      });
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Indicator size="large" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NaverLoginScreen;

import Indicator from '@/components/common/Indicator';
import useAuth from '@/hooks/queries/useAuth';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import NaverLogin from '@react-native-seoul/naver-login';
import Config from 'react-native-config';
import Toast from 'react-native-toast-message';

function NaverLoginScreen() {
  const {naverLoginMutation} = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 네이버 로그인 초기화
    NaverLogin.initialize({
      appName: 'matzip',
      consumerKey: Config.NAVER_CLIENT_ID!,
      consumerSecret: Config.NAVER_CLIENT_SECRET!,
      serviceUrlSchemeIOS: Config.NAVER_URL_SCHEME!,
    });

    handleNaverLogin();
  }, []);

  const handleNaverLogin = async () => {
    try {
      const result = await NaverLogin.login();

      if (result.isSuccess && result.successResponse) {
        const {accessToken} = result.successResponse;

        naverLoginMutation.mutate(accessToken, {
          onSuccess: () => {
            setIsLoading(false);
            Toast.show({
              type: 'success',
              text1: '네이버 로그인 성공',
              text2: '환영합니다!',
            });
          },
          onError: (error: any) => {
            setIsLoading(false);
            Toast.show({
              type: 'error',
              text1: '네이버 로그인 실패',
              text2:
                error.response?.data?.message || '나중에 다시 시도해주세요',
            });
          },
        });
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: '네이버 로그인 실패',
          text2: '나중에 다시 시도해주세요',
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('네이버 로그인 에러:', error);
      Toast.show({
        type: 'error',
        text1: '네이버 로그인 실패',
        text2: '나중에 다시 시도해주세요',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {isLoading && <Indicator size="large" />}
      </View>
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

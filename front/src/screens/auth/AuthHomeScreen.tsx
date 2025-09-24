import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants/colors';
import {useNaverLogin} from '@/hooks/auth/naver';
import useAuth from '@/hooks/queries/useAuth';
import useAppleSignInState from '@/hooks/useAppleSignInState';
import useGoogleSignInState from '@/hooks/useGoogleSignInState';
import useThemeStore, {Theme} from '@/store/theme';
import {AuthStackParamList} from '@/types/navigation';
import Toast from 'react-native-toast-message';

type Navigation = StackNavigationProp<AuthStackParamList>;

function AuthHomeScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();
  const {appleLoginMutation, googleLoginMutation, naverLoginMutation} =
    useAuth();
  const {isAvailable: isAppleSignInAvailable} = useAppleSignInState();
  const {
    isConfigured: isGoogleSignInConfigured,
    performSignIn: performGoogleSignIn,
  } = useGoogleSignInState();
  const naverLogin = useNaverLogin();

  const handleAppleLogin = async () => {
    try {
      const {identityToken, fullName, email} = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (identityToken) {
        appleLoginMutation.mutate(
          {
            identityToken,
            appId: 'com.matzip.app',
            email: email || undefined, // 이메일 가리기 포함하여 Apple에서 제공하는 이메일
            name: fullName
              ? {
                  givenName: fullName.givenName,
                  familyName: fullName.familyName,
                }
              : undefined, // 최초 로그인 시에만 제공되는 이름 정보
          },
          {
            onSuccess: () => {
              Toast.show({
                type: 'success',
                text1: 'Apple 로그인 성공',
                text2: '환영합니다!',
              });
            },
            onError: (error: any) => {
              Toast.show({
                type: 'error',
                text1: 'Apple 로그인이 실패했습니다.',
                text2:
                  error.response?.data?.message || '나중에 다시 시도해주세요',
              });
            },
          },
        );
      }
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        // 사용자가 로그인을 취소한 경우 - 별도 에러 표시 안함
        return;
      }

      console.error('Apple 로그인 에러:', error);
      Toast.show({
        type: 'error',
        text1: 'Apple 로그인이 실패했습니다.',
        text2: '나중에 다시 시도해주세요',
      });
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     const result = await performGoogleSignIn();

  //     if (result && result.idToken) {
  //       googleLoginMutation.mutate(
  //         {
  //           idToken: result.idToken,
  //           id: result.user.id,
  //           email: result.user.email,
  //           name: result.user.name,
  //           photoUrl: result.user.photo,
  //         },
  //         {
  //           onSuccess: () => {
  //             Toast.show({
  //               type: 'success',
  //               text1: 'Google 로그인 성공',
  //               text2: '환영합니다!',
  //             });
  //           },
  //           onError: (error: any) => {
  //             console.error('Google 로그인 에러:', error);
  //             Toast.show({
  //               type: 'error',
  //               text1: 'Google 로그인이 실패했습니다.',
  //               text2:
  //                 error.response?.data?.message || '나중에 다시 시도해주세요',
  //             });
  //           },
  //         },
  //       );
  //     }
  //   } catch (error: any) {
  //     if (error.message === 'CANCELLED') {
  //       // 사용자가 로그인을 취소한 경우 - 별도 에러 표시 안함
  //       return;
  //     }

  //     console.error('Google 로그인 에러:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Google 로그인이 실패했습니다.',
  //       text2: error.message || '나중에 다시 시도해주세요',
  //     });
  //   }
  // };

  const handleNaverLogin = async () => {
    try {
      const result = await naverLogin.performLogin();

      if (result) {
        naverLoginMutation.mutate(result.token, {
          onSuccess: () => {
            Toast.show({
              type: 'success',
              text1: '네이버 로그인 성공',
              text2: '환영합니다!',
            });
          },
          onError: (error: any) => {
            console.error('네이버 로그인 에러:', error);
            Toast.show({
              type: 'error',
              text1: '네이버 로그인이 실패했습니다.',
              text2:
                error.response?.data?.message || '나중에 다시 시도해주세요',
            });
          },
        });
      }
    } catch (error: any) {
      if (error.message === 'CANCELLED') {
        // 사용자가 로그인을 취소한 경우 - 별도 에러 표시 안함
        return;
      }

      console.error('네이버 로그인 에러:', error);
      Toast.show({
        type: 'error',
        text1: '네이버 로그인이 실패했습니다.',
        text2: error.message || '나중에 다시 시도해주세요',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('@/assets/yumyum.png')} resizeMode="contain" />
        <Text style={styles.titleText}>YUMYUM</Text>
        <Text style={styles.subtitleText}>우리만의 맛집 지도, 얌얌</Text>
      </View>
      <View style={styles.buttonContainer}>
        {Platform.OS === 'ios' && isAppleSignInAvailable && (
          <AppleButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={[
              styles.appleButton,
              appleLoginMutation.isPending && styles.disabledButton,
            ]}
            cornerRadius={3}
            onPress={appleLoginMutation.isPending ? () => {} : handleAppleLogin}
          />
        )}
        {/* {isGoogleSignInConfigured && (
          <GoogleSigninButton
            style={[
              styles.googleButton,
              googleLoginMutation.isPending && styles.disabledButton,
            ]}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={
              googleLoginMutation.isPending ? () => {} : handleGoogleLogin
            }
            disabled={googleLoginMutation.isPending}
          />
        )} */}
        <CustomButton
          label="카카오 로그인"
          style={styles.kakaoButtonContainer}
          textStyle={styles.kakaoButtonText}
          onPress={() => navigation.navigate('KakaoLogin')}
        />
        {naverLogin.isInitialized && (
          <CustomButton
            label="네이버 로그인"
            disabled={naverLoginMutation.isPending}
            style={styles.naverButtonContainer}
            textStyle={styles.naverButtonText}
            onPress={appleLoginMutation.isPending ? () => {} : handleNaverLogin}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    imageContainer: {
      flex: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#ED6029',
      marginTop: 20,
    },
    subtitleText: {
      fontSize: 24,
      color: colors[theme].BLACK,
      marginTop: 10,
      textAlign: 'center',
    },
    buttonContainer: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 30,
      gap: 15,
    },
    kakaoButtonContainer: {
      backgroundColor: '#fee503',
    },
    kakaoButtonText: {
      color: '#000000',
    },
    naverButtonContainer: {
      backgroundColor: '#03c75a',
    },
    naverButtonText: {
      color: '#000000',
    },
    appleButton: {
      width: '100%',
      height: 45,
    },
    googleButton: {
      width: '100%',
      height: 45,
    },
    disabledButton: {
      opacity: 0.6,
    },
  });

export default AuthHomeScreen;

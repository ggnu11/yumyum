import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants/colors';
import useAuth from '@/hooks/queries/useAuth';
import useThemeStore, {Theme} from '@/store/theme';
import {AuthStackParamList} from '@/types/navigation';
import Toast from 'react-native-toast-message';

type Navigation = StackNavigationProp<AuthStackParamList>;

function AuthHomeScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();
  const {appleLoginMutation} = useAuth();

  const handleAppleLogin = async () => {
    try {
      const {identityToken, fullName} = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (identityToken) {
        appleLoginMutation.mutate(
          {
            identityToken,
            appId: 'com.matzip.app',
            nickname: fullName?.givenName ?? '',
          },
          {
            onSuccess: () => {
              Toast.show({
                type: 'success',
                text1: '애플 로그인 성공',
                text2: '환영합니다!',
              });
            },
            onError: (error: any) => {
              Toast.show({
                type: 'error',
                text1: '애플 로그인이 실패했습니다.',
                text2:
                  error.response?.data?.message || '나중에 다시 시도해주세요',
              });
            },
          },
        );
      }
    } catch (error: any) {
      if (error.code !== appleAuth.Error.CANCELED) {
        Toast.show({
          type: 'error',
          text1: '애플 로그인이 실패했습니다.',
          text2: '나중에 다시 시도해주세요',
        });
      }
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
        {Platform.OS === 'ios' && (
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
        <CustomButton
          label="카카오 로그인"
          style={styles.kakaoButtonContainer}
          textStyle={styles.kakaoButtonText}
          onPress={() => navigation.navigate('KakaoLogin')}
        />
        <CustomButton
          label="네이버 로그인"
          style={styles.naverButtonContainer}
          textStyle={styles.naverButtonText}
          onPress={() => navigation.navigate('NaverLogin')}
        />
        <CustomButton
          label="이메일 로그인"
          onPress={() => navigation.navigate('Login')}
        />
        <Pressable onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.emailText}>이메일로 가입하기</Text>
        </Pressable>
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
      gap: 5,
    },
    emailText: {
      textDecorationLine: 'underline',
      fontWeight: '500',
      padding: 10,
      color: colors[theme].BLACK,
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
      width: Dimensions.get('screen').width,
      height: 45,
      paddingHorizontal: 30,
    },
    disabledButton: {
      opacity: 0.6,
    },
  });

export default AuthHomeScreen;

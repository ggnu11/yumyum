import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Config from 'react-native-config';
import {supabase} from '@/api/supabase';

import CustomButton from '@/components/common/CustomButton';
import queryClient from '@/api/queryClient';
import {colors} from '@/constants/colors';
import {queryKeys} from '@/constants/keys';
import useAuth from '@/hooks/queries/useAuth';
import useThemeStore, {Theme} from '@/store/theme';
import Toast from 'react-native-toast-message';

GoogleSignin.configure({
  iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
  webClientId: Config.GOOGLE_CLIENT_ID,
});

function AuthHomeScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
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
                text2: error?.message || '나중에 다시 시도해주세요',
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

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === 'success' && response.data.idToken) {
        const {error} = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.data.idToken,
        });

        if (error) {
          Toast.show({
            type: 'error',
            text1: '구글 로그인이 실패했습니다.',
            text2: error.message || '나중에 다시 시도해주세요',
          });
        } else {
          await queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]});
          Toast.show({
            type: 'success',
            text1: '구글 로그인 성공',
            text2: '환영합니다!',
          });
        }
      }
    } catch (error: any) {
      if (error.code !== 'SIGN_IN_CANCELLED') {
        Toast.show({
          type: 'error',
          text1: '구글 로그인이 실패했습니다.',
          text2: error?.message || '나중에 다시 시도해주세요',
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/matzip.png')}
          style={styles.image}
          resizeMode="contain"
          tintColor="#FDA242"
        />
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
          label="Google 로그인"
          style={styles.googleButtonContainer}
          textStyle={styles.googleButtonText}
          onPress={handleGoogleLogin}
        />
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
    },
    image: {
      width: 300,
      height: '100%',
    },
    buttonContainer: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 30,
      gap: 5,
    },
    googleButtonContainer: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: colors[theme].GRAY_500,
    },
    googleButtonText: {
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

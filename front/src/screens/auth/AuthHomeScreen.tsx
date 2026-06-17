import appleAuth from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Ionicons from '@react-native-vector-icons/ionicons';
import React, {useCallback, useEffect, useRef} from 'react';
import {
  Animated,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import ReAnimated, {
  Easing as REasing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

import Config from 'react-native-config';
import {supabase} from '@/api/supabase';

import queryClient from '@/api/queryClient';
import {queryKeys} from '@/constants/keys';
import useAuth from '@/hooks/queries/useAuth';
import Toast from 'react-native-toast-message';
import LoginBg from '@/assets/yumyum-login-bg.svg';

GoogleSignin.configure({
  iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
  webClientId: Config.GOOGLE_CLIENT_ID,
  offlineAccess: true,
});

function AnimatedButton({
  onPress,
  style,
  disabled,
  children,
}: {
  onPress: () => void;
  style: any[];
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        ...style,
        {transform: [{scale: scaleAnim}]},
        disabled && styles.disabledButton,
      ]}>
      <Pressable
        style={styles.buttonInner}
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

// SVG viewBox: 260 x 1080, 상반부(540)와 하반부(540) 동일 패턴
const SVG_VIEWBOX_W = 260;
const SVG_TILE_H = 540;
const BG_SCROLL_DURATION = 20000;

function AuthHomeScreen() {
  const {appleLoginMutation} = useAuth();
  const {width: screenWidth} = useWindowDimensions();

  const tilePixelHeight = Math.round(screenWidth * (SVG_TILE_H / SVG_VIEWBOX_W));
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-tilePixelHeight, {
        duration: BG_SCROLL_DURATION,
        easing: REasing.linear,
      }),
      -1,    // 무한 반복
      false, // autoreverses: false
    );
  }, [tilePixelHeight]);

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const handleAppleLogin = useCallback(async () => {
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
  }, [appleLoginMutation]);

  const handleGoogleLogin = useCallback(async () => {
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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgContainer}>
        <ReAnimated.View
          style={[
            {width: screenWidth, height: tilePixelHeight * 2},
            bgAnimatedStyle,
          ]}>
          <LoginBg
            width={screenWidth}
            height={tilePixelHeight * 2}
            preserveAspectRatio="none"
          />
        </ReAnimated.View>
      </View>

      <View style={styles.logoContainer}>
        <View style={styles.logoCapsule}>
          <Text style={styles.logoText}>YUMYUM</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {Platform.OS === 'ios' && (
          <AnimatedButton
            onPress={handleAppleLogin}
            disabled={appleLoginMutation.isPending}
            style={[styles.socialButton, styles.appleButton]}>
            <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
            <Text style={styles.appleButtonText}>Apple로 로그인</Text>
          </AnimatedButton>
        )}
        <AnimatedButton
          onPress={handleGoogleLogin}
          style={[styles.socialButton, styles.googleButton]}>
          <Ionicons name="logo-google" size={18} color="#E8872A" />
          <Text style={styles.googleButtonText}>Google로 로그인</Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF4E0',
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: 'hidden',
  },
  logoContainer: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoCapsule: {
    backgroundColor: 'rgba(253, 244, 224, 0.85)',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 40,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#E8872A',
    letterSpacing: 4,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 12,
    zIndex: 1,
  },
  socialButton: {
    width: '100%',
    height: 50,
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  appleButton: {
    backgroundColor: '#E8872A',
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8872A',
  },
  googleButtonText: {
    color: '#E8872A',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default AuthHomeScreen;

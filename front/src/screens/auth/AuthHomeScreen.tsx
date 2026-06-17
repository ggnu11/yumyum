import appleAuth from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Ionicons from '@react-native-vector-icons/ionicons';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
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
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Svg, {Path, Circle, Ellipse} from 'react-native-svg';

import Config from 'react-native-config';
import {supabase} from '@/api/supabase';

import queryClient from '@/api/queryClient';
import {queryKeys} from '@/constants/keys';
import useAuth from '@/hooks/queries/useAuth';
import Toast from 'react-native-toast-message';
import LoginBg from '@/assets/yumyum-login-bg.png';

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

const ReAnimatedSvgPath = ReAnimated.createAnimatedComponent(Path);
const ReAnimatedEllipse = ReAnimated.createAnimatedComponent(Ellipse);

function IntroOverlay({onFinish}: {onFinish: () => void}) {
  // Road stroke
  const roadProgress = useSharedValue(0);
  // Pin
  const pinTranslateY = useSharedValue(-60);
  const pinOpacity = useSharedValue(0);
  // Shadow
  const shadowScale = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  // Logo
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(15);
  // Overlay fade out
  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    // 1. Road stroke: 0-600ms
    roadProgress.value = withTiming(1, {duration: 600, easing: REasing.out(REasing.cubic)});

    // 2. Pin bounce: starts at 500ms
    pinOpacity.value = withDelay(500, withTiming(1, {duration: 80}));
    pinTranslateY.value = withDelay(500, withSpring(0, {damping: 8, stiffness: 200}));

    // 3. Shadow: starts at 700ms
    shadowOpacity.value = withDelay(700, withTiming(0.3, {duration: 250}));
    shadowScale.value = withDelay(700, withSpring(1, {damping: 12, stiffness: 150}));

    // 4. Logo fade in: starts at 1000ms
    logoOpacity.value = withDelay(1000, withTiming(1, {duration: 400}));
    logoTranslateY.value = withDelay(1000, withTiming(0, {duration: 400, easing: REasing.out(REasing.cubic)}));

    // 5. Fade out overlay: starts at 1700ms
    overlayOpacity.value = withDelay(1700, withTiming(0, {duration: 400}, () => {
      runOnJS(onFinish)();
    }));
  }, []);

  const roadProps = useAnimatedProps(() => ({
    strokeDashoffset: 120 * (1 - roadProgress.value),
  }));

  const pinStyle = useAnimatedStyle(() => ({
    opacity: pinOpacity.value,
    transform: [{translateY: pinTranslateY.value}],
  }));

  const shadowProps = useAnimatedProps(() => ({
    opacity: shadowOpacity.value,
    rx: 8 * shadowScale.value,
    ry: 3 * shadowScale.value,
  }));

  const introLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{translateY: logoTranslateY.value}],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <ReAnimated.View style={[styles.introOverlay, containerStyle]}>
      <View style={styles.introContent}>
        {/* Road */}
        <Svg width={100} height={80} viewBox="0 0 100 80">
          <ReAnimatedSvgPath
            d="M10 70 Q30 40 50 45 Q70 50 90 20"
            stroke="#2A9D8F"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={120}
            animatedProps={roadProps}
          />
          {/* Pin shadow */}
          <ReAnimatedEllipse
            cx={50}
            cy={48}
            rx={0}
            ry={0}
            fill="#00000040"
            animatedProps={shadowProps}
          />
        </Svg>
        {/* Pin */}
        <ReAnimated.View style={[styles.introPinContainer, pinStyle]}>
          <Svg width={28} height={36} viewBox="0 0 28 36">
            <Path
              d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z"
              fill="#E8872A"
            />
            <Circle cx={14} cy={14} r={6} fill="#FDF4E0" />
          </Svg>
        </ReAnimated.View>
        {/* Logo text */}
        <ReAnimated.Text style={[styles.introLogoText, introLogoStyle]}>
          YUMYUM
        </ReAnimated.Text>
      </View>
    </ReAnimated.View>
  );
}

// SVG viewBox: 260 x 1080, 상반부(540)와 하반부(540) 동일 패턴
const SVG_VIEWBOX_W = 260;
const SVG_TILE_H = 540;
const BG_SCROLL_DURATION = 20000;

function AuthHomeScreen() {
  const {appleLoginMutation} = useAuth();
  const {width: screenWidth} = useWindowDimensions();
  const [showIntro, setShowIntro] = useState(true);

  const tilePixelHeight = Math.round(
    screenWidth * (SVG_TILE_H / SVG_VIEWBOX_W),
  );
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-tilePixelHeight, {
        duration: BG_SCROLL_DURATION,
        easing: REasing.linear,
      }),
      -1, // 무한 반복
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
          <Image
            source={LoginBg}
            style={{width: screenWidth, height: tilePixelHeight * 2}}
            resizeMode="stretch"
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
      {showIntro && <IntroOverlay onFinish={() => setShowIntro(false)} />}
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
    fontFamily: 'Baloo2',
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
  introOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: '#FDF4E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introContent: {
    alignItems: 'center',
  },
  introPinContainer: {
    marginTop: -20,
  },
  introLogoText: {
    marginTop: 12,
    fontSize: 32,
    fontFamily: 'Baloo2',
    fontWeight: '800',
    color: '#E8872A',
    letterSpacing: 3,
  },
});

export default AuthHomeScreen;

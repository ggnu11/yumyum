import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { WebViewNavigation } from 'react-native-webview';
import Indicator from '@/components/common/Indicator';
import useAuth from '@/hooks/queries/useAuth';
import Config from 'react-native-config';

const REDIRECT_URI = 'http://localhost:3031/auth/oauth/kakao';

export default function KakaoLoginScreen() {
  const { kakaoLoginMutation } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Send the authorization code to backend
  const requestToken = async (code: string) => {
    setIsLoading(true);
    kakaoLoginMutation.mutate(
      { code }, // pass the code in request body
      {
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: (error: any) => {
          console.error('카카오 로그인 실패:', error);
          setIsLoading(false);
        },
      },
    );
  };

  // Capture code from redirect URL in WebView
  const handleShouldStartLoadWithRequest = (event: WebViewNavigation) => {
    if (event.url.startsWith(`${REDIRECT_URI}?code=`)) {
      const code = event.url.split('code=')[1];
      if (code) requestToken(code);
      return false; // prevent WebView from navigating to redirect URI
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Indicator size="large" />}
      <WebView
        style={styles.container}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${Config.KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&scope=profile_nickname,account_email`,
        }}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

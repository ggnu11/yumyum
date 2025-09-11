import React, {useRef} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';

import CustomButton from '@/components/common/CustomButton';
import InputField from '@/components/common/InputField';
import {errorMessages} from '@/constants/messages';
import useAuth from '@/hooks/queries/useAuth';
import useForm from '@/hooks/useForm';
import {validateLogin} from '@/utils/validation';
import Toast from 'react-native-toast-message';

function LoginScreen() {
  const {loginMutation} = useAuth();
  const passwordRef = useRef<TextInput | null>(null);
  const login = useForm({
    initialValue: {email: '', password: ''},
    validate: validateLogin,
  });

  const handleSubmit = () => {
    const {email, password} = login.values;

    // 필수 필드 검증
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: '이메일을 입력해주세요.',
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: '비밀번호를 입력해주세요.',
      });
      return;
    }

    // 이메일 형식 검증 (실시간 검증과 동일)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Toast.show({
        type: 'error',
        text1: '올바른 이메일 형식이 아닙니다.',
      });
      return;
    }

    // 비밀번호 길이 검증 (실시간 검증과 동일)
    if (password.length < 8 || password.length > 20) {
      Toast.show({
        type: 'error',
        text1: '비밀번호는 8~20자 사이로 입력해주세요.',
      });
      return;
    }

    loginMutation.mutate(login.values, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: '로그인 성공',
          text2: '환영합니다!',
        });
      },
      onError: error =>
        Toast.show({
          type: 'error',
          text1: error.response?.data.message || errorMessages.UNEXPECT_ERROR,
        }),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          autoFocus
          placeholder="이메일"
          submitBehavior="submit"
          returnKeyType="next"
          inputMode="email"
          onSubmitEditing={() => passwordRef.current?.focus()}
          touched={login.touched.email}
          error={login.errors.email}
          {...login.getTextInputProps('email')}
        />
        <InputField
          ref={passwordRef}
          secureTextEntry
          textContentType="oneTimeCode"
          placeholder="비밀번호"
          returnKeyType="join"
          maxLength={20}
          onSubmitEditing={handleSubmit}
          touched={login.touched.password}
          error={login.errors.password}
          {...login.getTextInputProps('password')}
        />
      </View>
      <CustomButton
        label="로그인"
        variant="filled"
        size="large"
        onPress={handleSubmit}
        disabled={loginMutation.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 30,
  },
});

export default LoginScreen;

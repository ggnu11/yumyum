import Ionicons from '@react-native-vector-icons/ionicons';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import {checkNickname} from '@/api/auth';
import FixedBottomCTA from '@/components/common/FixedBottomCTA';
import CustomText from '@/components/common/CustomText';
import {colors} from '@/constants/colors';
import useAuth from '@/hooks/queries/useAuth';
import useImagePicker from '@/hooks/useImagePicker';
import useModal from '@/hooks/useModal';
import useThemeStore, {Theme} from '@/store/theme';
import useDebounce from '@/hooks/useDebounce';
import EditProfileActionSheet from '@/components/setting/EditProfileActionSheet';

function ProfileRegistrationScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const {auth, profileMutation} = useAuth();
  const imageAction = useModal();
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);

  const debouncedNickname = useDebounce(nickname, 500);

  // SSO 플랫폼에서 가져온 이미지가 있으면 사용, 없으면 빈 배열
  // imagePicker는 이미지를 선택할 때만 서버에 업로드하므로, 
  // SSO에서 가져온 이미지는 직접 표시하고 imagePicker에는 포함하지 않음
  const imagePicker = useImagePicker({
    initialImages: [],
    mode: 'single',
    onSettled: imageAction.hide,
  });

  // 표시할 이미지 URI 결정: imagePicker에 새로 선택한 이미지가 있으면 그것을, 없으면 SSO 이미지, 둘 다 없으면 기본 이미지
  const displayImageUri =
    imagePicker.imageUris.length > 0 && imagePicker.imageUris[0]?.uri
      ? imagePicker.imageUris[0].uri
      : auth.imageUri || null;

  // 닉네임 유효성 검증
  const validateNickname = (value: string): string => {
    if (value.trim().length === 0) {
      return '';
    }

    if (value.length < 2 || value.length > 10) {
      return '닉네임은 2자 이상 10자 이하로 입력해주세요.';
    }

    // 한글, 영문, 숫자만 허용
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
    if (!nicknameRegex.test(value)) {
      return '특수문자는 사용할 수 없어요';
    }

    return '';
  };

  // 닉네임 중복 확인
  useEffect(() => {
    const checkNicknameAvailability = async () => {
      const validationError = validateNickname(debouncedNickname);
      setNicknameError(validationError);

      if (validationError) {
        setIsNicknameValid(false);
        setNicknameAvailable(false);
        return;
      }

      if (debouncedNickname.trim().length === 0) {
        setIsNicknameValid(false);
        setNicknameAvailable(false);
        return;
      }

      setIsCheckingNickname(true);
      try {
        const response = await checkNickname(debouncedNickname);
        if (response.available) {
          setNicknameError('');
          setIsNicknameValid(true);
          setNicknameAvailable(true);
        } else {
          setNicknameError('이미 사용중인 닉네임이에요');
          setIsNicknameValid(false);
          setNicknameAvailable(false);
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || '닉네임 확인 중 오류가 발생했습니다.';
        setNicknameError(errorMessage);
        setIsNicknameValid(false);
        setNicknameAvailable(false);
      } finally {
        setIsCheckingNickname(false);
      }
    };

    checkNicknameAvailability();
  }, [debouncedNickname]);

  const handlePressImage = () => {
    imageAction.show();
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    if (!isNicknameValid || !nicknameAvailable) {
      Toast.show({
        type: 'error',
        text1: '닉네임을 확인해주세요',
        text2: '유효한 닉네임을 입력해주세요.',
      });
      return;
    }

    profileMutation.mutate(
      {
        nickname,
        // imagePicker에 새로 선택한 이미지가 있으면 그것을 사용, 없으면 SSO 이미지 사용
        imageUri: displayImageUri || undefined,
      },
      {
        onSuccess: () => {
          // 프로필 등록 성공 시 자동으로 홈 화면으로 이동 (RootNavigation에서 처리)
          // queryClient가 자동으로 프로필을 업데이트하므로 RootNavigation이 자동으로 BottomTabNavigation으로 전환됨
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: '프로필 등록 실패',
            text2:
              error.response?.data?.message || '나중에 다시 시도해주세요',
            position: 'bottom',
          });
        },
      },
    );
  };

  const isButtonDisabled =
    !isNicknameValid || !nicknameAvailable || isCheckingNickname;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <CustomText style={styles.title}>프로필 등록</CustomText>
          </View>

          <View style={styles.content}>
            <CustomText style={styles.welcomeText}>환영합니다!</CustomText>
            <CustomText style={styles.subtitleText}>
              서비스 프로필을 설정해주세요
            </CustomText>

            <View style={styles.profileContainer}>
              <Pressable
                style={styles.imageContainer}
                onPress={handlePressImage}>
                {displayImageUri ? (
                  <Image
                    source={{uri: displayImageUri}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.emptyImageContainer}>
                    <Image
                      source={require('@/assets/default-user.png')}
                      style={styles.defaultImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </Pressable>
            </View>

            <View style={styles.inputSection}>
              <CustomText style={styles.label}>
                닉네임 <CustomText style={styles.required}>*</CustomText>
              </CustomText>
              <View
                style={[
                  styles.inputContainer,
                  nicknameError && styles.inputContainerError,
                  isNicknameValid && !nicknameError && styles.inputContainerSuccess,
                ]}>
                <TextInput
                  style={styles.input}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="닉네임을 입력해주세요"
                  placeholderTextColor={colors[theme].GRAY_500}
                  maxLength={10}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <CustomText
                  style={[
                    styles.charCount,
                    nicknameError && styles.charCountError,
                    isNicknameValid && !nicknameError && styles.charCountSuccess,
                  ]}>
                  {nickname.length}/10
                </CustomText>
              </View>
              {nicknameError ? (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={colors[theme].RED_500}
                  />
                  <CustomText style={styles.errorText}>{nicknameError}</CustomText>
                </View>
              ) : isNicknameValid && nicknameAvailable ? (
                <View style={styles.successContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors[theme].PURPLE_100}
                  />
                  <CustomText style={styles.successText}>
                    사용 가능한 닉네임이에요
                  </CustomText>
                </View>
              ) : (
                <View style={styles.hintContainer}>
                  <CustomText style={styles.hintText}>
                    ① 한글, 영문, 숫자로 이루어진 10자 이내 닉네임만 사용 가능해요
                  </CustomText>
                </View>
              )}
            </View>

            <View style={styles.inputSection}>
              <CustomText style={styles.label}>내 친구코드</CustomText>
              <View style={[styles.inputContainer, styles.disabledInput]}>
                <TextInput
                  style={[styles.input, styles.disabledInputText]}
                  value={auth.yumyum_id ? `@${auth.yumyum_id}` : '@yumyum12'}
                  editable={false}
                  placeholderTextColor={colors[theme].GRAY_500}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <FixedBottomCTA
        label="YUMYUM 시작하기"
        onPress={handleSubmit}
        disabled={isButtonDisabled}
      />

      <EditProfileActionSheet
        isVisible={imageAction.isVisible}
        hideAction={imageAction.hide}
        onChangeImage={imagePicker.handleChangeImage}
      />
    </>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme][0],
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 100,
    },
    header: {
      paddingTop: Platform.OS === 'ios' ? 0 : 20,
      paddingHorizontal: 20,
      paddingVertical: 16,
      alignItems: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors[theme][100],
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors[theme][100],
      marginTop: 20,
    },
    subtitleText: {
      fontSize: 16,
      color: colors[theme].PURPLE_100,
      marginTop: 8,
      marginBottom: 40,
    },
    profileContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    imageContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    emptyImageContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: colors[theme].GRAY_200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    defaultImage: {
      width: '100%',
      height: '100%',
    },
    inputSection: {
      marginBottom: 24,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors[theme][100],
      marginBottom: 8,
    },
    required: {
      color: colors[theme].RED_500,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors[theme].GRAY_200,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 50,
    },
    inputContainerError: {
      borderColor: colors[theme].RED_500,
    },
    inputContainerSuccess: {
      borderColor: colors[theme].PURPLE_100,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors[theme][100],
      padding: 0,
    },
    disabledInput: {
      backgroundColor: colors[theme].GRAY_100,
    },
    disabledInputText: {
      color: colors[theme].GRAY_500,
    },
    charCount: {
      fontSize: 12,
      color: colors[theme].GRAY_500,
      marginLeft: 8,
    },
    charCountError: {
      color: colors[theme].RED_500,
    },
    charCountSuccess: {
      color: colors[theme].PURPLE_100,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    errorText: {
      fontSize: 12,
      color: colors[theme].RED_500,
      marginLeft: 4,
    },
    successContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    successText: {
      fontSize: 12,
      color: colors[theme].PURPLE_100,
      marginLeft: 4,
    },
    hintContainer: {
      marginTop: 8,
    },
    hintText: {
      fontSize: 12,
      color: colors[theme].GRAY_500,
    },
  });

export default ProfileRegistrationScreen;


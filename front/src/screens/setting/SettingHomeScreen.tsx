import SettingItem from '@/components/setting/SettingItem';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import DarkModeActionSheet from '@/components/setting/DarkModeActionSheet';
import {colors} from '@/constants/colors';
import useAuth from '@/hooks/queries/useAuth';
import useModal from '@/hooks/useModal';
import useThemeStore, {Theme} from '@/store/theme';
import {SettingStackParamList} from '@/types/navigation';

type Navigation = NavigationProp<SettingStackParamList>;

function SettingHomeScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();
  const {logoutMutation, withdrawMutation} = useAuth();
  const darkModeAction = useModal();

  const handleWithdrawUser = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: () => {
            withdrawMutation.mutate(null, {
              onSuccess: () => {
                Toast.show({
                  type: 'success',
                  text1: '회원탈퇴가 완료되었습니다.',
                  position: 'bottom',
                });
              },
              onError: () => {
                Toast.show({
                  type: 'error',
                  text1: '회원탈퇴 중 오류가 발생했습니다.',
                  position: 'bottom',
                });
              },
            });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.space} />
        <SettingItem
          title="프로필 수정"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <SettingItem title="다크 모드" onPress={darkModeAction.show} />
        <View style={styles.space} />
        <SettingItem
          title="로그아웃"
          color={colors[theme].RED_500}
          onPress={() => logoutMutation.mutate(null)}
        />

        <View style={styles.bottomSpace} />

        <DarkModeActionSheet
          isVisible={darkModeAction.isVisible}
          hideAction={darkModeAction.hide}
        />
      </ScrollView>

      <View style={styles.withdrawContainer}>
        <Pressable onPress={handleWithdrawUser} style={styles.withdrawButton}>
          <Text style={styles.withdrawText}>회원 탈퇴</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme].WHITE,
    },
    scrollView: {
      flex: 1,
    },
    space: {
      height: 30,
    },
    bottomSpace: {
      height: 100,
    },
    withdrawContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors[theme].WHITE,
      paddingHorizontal: 20,
      paddingVertical: 30,
    },
    withdrawButton: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    withdrawText: {
      fontSize: 16,
      color: colors[theme].GRAY_500,
      textDecorationLine: 'underline',
    },
  });

export default SettingHomeScreen;

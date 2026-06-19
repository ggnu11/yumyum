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

import {useTranslation} from 'react-i18next';
import DarkModeActionSheet from '@/components/setting/DarkModeActionSheet';
import LanguageActionSheet from '@/components/setting/LanguageActionSheet';
import {colors} from '@/constants/colors';
import useAuth from '@/hooks/queries/useAuth';
import useModal from '@/hooks/useModal';
import useThemeStore, {Theme} from '@/store/theme';
import {SettingStackParamList} from '@/types/navigation';

type Navigation = NavigationProp<SettingStackParamList>;

function SettingHomeScreen() {
  const {t} = useTranslation();
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();
  const {auth, logoutMutation, withdrawMutation} = useAuth();
  const darkModeAction = useModal();
  const languageAction = useModal();

  const handleWithdrawUser = () => {
    Alert.alert(
      t('setting.withdraw'),
      t('setting.withdrawConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('setting.withdrawButton'),
          style: 'destructive',
          onPress: async () => {
            withdrawMutation.mutate(null, {
              onSuccess: () => {
                Toast.show({
                  type: 'success',
                  text1: t('setting.withdrawSuccess'),
                  position: 'bottom',
                });
              },
              onError: (error: any) => {
                console.log('[회원탈퇴 에러]', JSON.stringify(error, null, 2));
                Toast.show({
                  type: 'error',
                  text1: t('setting.withdrawError'),
                  text2: error?.message || '',
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
          title={t('setting.editProfile')}
          onPress={() => navigation.navigate('EditProfile')}
        />
        <SettingItem title={t('setting.darkMode')} onPress={darkModeAction.show} />
        <SettingItem title={t('setting.language')} onPress={languageAction.show} />
        <View style={styles.space} />
        <SettingItem
          title={t('setting.logout')}
          color={colors[theme].RED_500}
          onPress={() =>
            Alert.alert(t('setting.logout'), t('setting.logoutConfirm'), [
              {text: t('common.cancel'), style: 'cancel'},
              {
                text: t('setting.logout'),
                style: 'destructive',
                onPress: () =>
                  logoutMutation.mutate(null, {
                    onSuccess: () => {
                      Toast.show({
                        type: 'success',
                        text1: t('setting.logoutSuccess'),
                        position: 'bottom',
                      });
                    },
                  }),
              },
            ])
          }
        />

        <View style={styles.bottomSpace} />

        <DarkModeActionSheet
          isVisible={darkModeAction.isVisible}
          hideAction={darkModeAction.hide}
        />
        <LanguageActionSheet
          isVisible={languageAction.isVisible}
          hideAction={languageAction.hide}
        />
      </ScrollView>

      <View style={styles.withdrawContainer}>
        <Pressable onPress={handleWithdrawUser} style={styles.withdrawButton}>
          <Text style={styles.withdrawText}>{t('setting.withdraw')}</Text>
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

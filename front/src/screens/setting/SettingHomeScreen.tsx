import Ionicons from '@react-native-vector-icons/ionicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import CustomText from '@/components/common/CustomText';
import {colors} from '@/constants/colors';
import useAuth from '@/hooks/queries/useAuth';
import useThemeStore, {Theme} from '@/store/theme';
import {SettingStackParamList} from '@/types/navigation';

type Navigation = NavigationProp<SettingStackParamList>;

interface MenuItemProps {
  title: string;
  onPress?: () => void;
}

function MenuItem({title, onPress}: MenuItemProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <Pressable
      style={({pressed}) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}
      onPress={onPress}>
      <CustomText style={styles.menuItemText}>{title}</CustomText>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors[theme].GRAY_500}
      />
    </Pressable>
  );
}

function SettingHomeScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();
  const {auth} = useAuth();
  const inset = useSafeAreaInsets();

  // TODO: 친구 수와 모임 수는 API 연동 후 실제 데이터로 교체
  const friendCount = 36;
  const groupCount = 3;

  // 사용자 ID 생성 (yumyum_id 사용)
  const userId = auth.yumyum_id ? `@${auth.yumyum_id}` : '@QI2kd3ie';

  return (
    <View style={styles.container}>
      {/* 커스텀 헤더 */}
      <View style={[styles.header, {paddingTop: inset.top}]}>
        <Pressable
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors[theme][100]} />
        </Pressable>
        <CustomText style={styles.headerTitle}>마이페이지</CustomText>
        <Pressable style={styles.headerButton}>
          <Ionicons
            name="square-outline"
            size={24}
            color={colors[theme][100]}
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileMain}>
            <Image
              source={
                auth.imageUri
                  ? {uri: auth.imageUri}
                  : require('@/assets/default-user.png')
              }
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <CustomText style={styles.username}>
                {auth.nickname || '행복한물고기34'}
              </CustomText>
              <CustomText style={styles.userId}>{userId}</CustomText>
            </View>
            <View style={styles.countInfo}>
              <View style={styles.countItem}>
                <CustomText style={styles.countLabel}>친구</CustomText>
                <CustomText style={styles.countValue}>{friendCount}</CustomText>
              </View>
              <View style={styles.countItem}>
                <CustomText style={styles.countLabel}>모임</CustomText>
                <CustomText style={styles.countValue}>{groupCount}</CustomText>
              </View>
            </View>
          </View>
          <Pressable
            style={styles.changeNicknameButton}
            onPress={() => navigation.navigate('EditProfile')}>
            <CustomText style={styles.changeNicknameText}>
              닉네임 변경하기
            </CustomText>
          </Pressable>
        </View>

        {/* 친구 관리 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>친구 관리</CustomText>
          <View style={styles.menuContainer}>
            <MenuItem title="친구 초대하기" />
            <MenuItem title="친구 목록 확인하기" />
            <MenuItem title="친구 요청 관리하기" />
          </View>
        </View>

        {/* 모임 관리 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>모임 관리</CustomText>
          <View style={styles.menuContainer}>
            <MenuItem title="모임 초대하기" />
            <MenuItem title="모임 목록 확인하기" />
            <MenuItem title="모임 요청 관리하기" />
          </View>
        </View>

        {/* 설정 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>설정</CustomText>
          <View style={styles.menuContainer}>
            <MenuItem title="공지사항" />
            <MenuItem title="이용약관" />
            <MenuItem title="개인정보취급방침" />
          </View>
        </View>

        {/* 앱 버전 */}
        <View style={styles.versionContainer}>
          <CustomText style={styles.versionText}>앱 버전 : 1.0.0</CustomText>
        </View>
      </ScrollView>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme][0],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors[theme].GRAY_200,
      backgroundColor: colors[theme][0],
    },
    headerButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors[theme][100],
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    profileSection: {
      padding: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors[theme].GRAY_200,
    },
    profileMain: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    profileImage: {
      width: 51,
      height: 51,
      borderRadius: 25.5,
      backgroundColor: colors[theme].GRAY_200,
      marginRight: 16,
    },
    profileInfo: {
      flex: 1,
      gap: 8,
    },
    username: {
      fontSize: 18,
      fontWeight: '600',
      color: colors[theme][100],
    },
    userId: {
      fontSize: 14,
      color: '#D4A574', // 황갈색 계열
      width: 58,
      height: 14,
    },
    countInfo: {
      flexDirection: 'row',
      gap: 24,
      alignItems: 'center',
    },
    countItem: {
      alignItems: 'center',
      gap: 4,
    },
    countLabel: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
    },
    countValue: {
      fontSize: 18,
      fontWeight: '600',
      color: colors[theme][100],
    },
    changeNicknameButton: {
      backgroundColor: colors[theme].GRAY_200,
      borderRadius: 8,
      width: 348,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },
    changeNicknameText: {
      fontSize: 14,
      color: colors[theme][100],
      fontWeight: '500',
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors[theme][100],
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    menuContainer: {
      backgroundColor: colors[theme][0],
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors[theme].GRAY_200,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors[theme].GRAY_200,
    },
    menuItemPressed: {
      backgroundColor: colors[theme].GRAY_100,
    },
    menuItemText: {
      fontSize: 16,
      color: colors[theme][100],
    },
    versionContainer: {
      alignItems: 'flex-end',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    versionText: {
      fontSize: 12,
      color: colors[theme].GRAY_500,
    },
  });

export default SettingHomeScreen;

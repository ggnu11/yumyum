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

  // TODO: 친구 수는 API 연동 후 실제 데이터로 교체
  const friendCount = 36;

  // 사용자 ID 생성 (실제로는 API에서 받아올 수 있음)
  const userId = auth.id ? `@${auth.id.slice(0, 8)}` : '@QI2kd3ie';

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
          <View style={styles.profileLeft}>
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
              <View style={styles.statusRow}>
                <CustomText style={styles.status}>맛집 탐험가!</CustomText>
                <Pressable
                  style={styles.editButton}
                  onPress={() => navigation.navigate('EditProfile')}>
                  <CustomText style={styles.editButtonText}>
                    프로필 편집
                  </CustomText>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.friendInfo}>
            <CustomText style={styles.friendLabel}>친구</CustomText>
            <CustomText style={styles.friendCount}>{friendCount}</CustomText>
          </View>
        </View>

        {/* 친구 관리 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>친구 관리</CustomText>
          <View style={styles.menuContainer}>
            <MenuItem title="친구 초대하기 (추가)" />
            <MenuItem title="친구 목록 확인하기" />
            <MenuItem title="친구 요청 관리하기" />
            <MenuItem title="친구 검색하기" />
          </View>
        </View>

        {/* 그룹 관리 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>그룹 관리</CustomText>
          <View style={styles.menuContainer}>
            <MenuItem title="그룹 초대하기" />
            <MenuItem title="그룹 목록 확인하기" />
            <MenuItem title="그룹 요청 관리하기" />
          </View>
        </View>

        {/* 결제 관리 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>결제 관리</CustomText>
          <View style={styles.menuContainer}>
            <MenuItem title="상점" />
            <MenuItem title="구매 내역" />
            <MenuItem title="구매 복원" />
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
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors[theme].GRAY_200,
    },
    profileLeft: {
      flexDirection: 'row',
      flex: 1,
      gap: 12,
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors[theme].GRAY_200,
    },
    profileInfo: {
      flex: 1,
      gap: 4,
    },
    username: {
      fontSize: 16,
      fontWeight: '600',
      color: colors[theme][100],
    },
    userId: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
    },
    status: {
      fontSize: 14,
      color: colors[theme][100],
    },
    editButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      backgroundColor: colors[theme].GRAY_100,
    },
    editButtonText: {
      fontSize: 12,
      color: colors[theme][100],
    },
    friendInfo: {
      alignItems: 'center',
      gap: 4,
    },
    friendLabel: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
    },
    friendCount: {
      fontSize: 16,
      fontWeight: '600',
      color: colors[theme][100],
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

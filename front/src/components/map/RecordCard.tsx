import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from '../common/CustomText';
import RecordAuthorInfo from './RecordAuthorInfo';
import RecordActionMenu from './RecordActionMenu';
import RecordImageView from './RecordImageView';
import useAuth from '@/hooks/queries/useAuth';

import {RecordData} from '../../types/api';

// RecordData는 types/api.ts에서 import

interface RecordCardProps {
  record: RecordData;
  isExpanded?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

function RecordCard({
  record,
  isExpanded = false,
  onEdit,
  onDelete,
}: RecordCardProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const {auth} = useAuth();

  // visibility 배열에서 표시할 텍스트 생성
  const getVisibilityText = () => {
    if (!record.visibility || record.visibility.length === 0) {
      return '내 카드';
    }
    
    // PRIVATE이 항상 포함되므로 제외하고 표시
    const visibleTypes = record.visibility.filter(v => v !== 'PRIVATE');
    if (visibleTypes.length === 0) {
      return '내 카드';
    }
    
    // FRIEND가 있으면 "친구 +N" 형식으로 표시
    const friendCount = visibleTypes.filter(v => v === 'FRIEND').length;
    const groupCount = visibleTypes.filter(v => v === 'GROUP').length;
    
    if (friendCount > 0 && groupCount > 0) {
      return `친구 +${friendCount}, ${record.groupName || '그룹'} +${groupCount}`;
    }
    if (friendCount > 0) {
      return friendCount === 1 ? '친구' : `친구 +${friendCount}`;
    }
    if (groupCount > 0) {
      return record.groupName || '그룹';
    }
    
    return '내 카드';
  };

  // origin_type에 따른 텍스트
  const getOriginText = () => {
    if (record.originType === 'FRIEND') {
      return '친구';
    }
    if (record.originType === 'GROUP') {
      return record.groupName || '그룹';
    }
    return '';
  };

  // 날짜 포맷팅 (YYYY.MM.DD)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch {
      return dateString;
    }
  };

  // 프로필 이미지 URL
  const profileImageUri = record.isOwner
    ? auth.imageUri
    : record.author?.profileImage;

  // 닉네임
  const nickname = record.isOwner
    ? auth.nickname || '사용자'
    : record.author?.name || '사용자';

  return (
    <View style={styles.container}>
      {/* 카드 헤더 */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          {/* 프로필 이미지 */}
          {profileImageUri ? (
            <Image
              source={{uri: profileImageUri}}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.defaultProfileImage}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors[theme].GRAY_500}
              />
            </View>
          )}
          
          {/* 닉네임 및 정보 */}
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <CustomText style={styles.nickname}>{nickname}</CustomText>
              <View style={styles.badgeRow}>
                <CustomText style={styles.badgeText}>
                  {record.isOwner ? getVisibilityText() : getOriginText()}
                </CustomText>
                {record.isOwner && (
                  <Ionicons
                    name="lock-closed"
                    size={12}
                    color={colors[theme].GRAY_500}
                    style={styles.lockIcon}
                  />
                )}
                {!record.isOwner && record.originType === 'FRIEND' && (
                  <View style={styles.personIconContainer}>
                    <Ionicons
                      name="person"
                      size={12}
                      color={colors[theme].GRAY_500}
                    />
                    <CustomText style={styles.personCount}>+1</CustomText>
                  </View>
                )}
                {!record.isOwner && record.originType === 'GROUP' && (
                  <View style={styles.personIconContainer}>
                    <View style={styles.redDot} />
                    <Ionicons
                      name="person"
                      size={12}
                      color={colors[theme].GRAY_500}
                    />
                    <CustomText style={styles.personCount}>+2</CustomText>
                  </View>
                )}
              </View>
            </View>
            <CustomText style={styles.date}>
              {formatDate(record.date)}
            </CustomText>
          </View>
        </View>

        {/* 메뉴 버튼 */}
        {record.isOwner && (
          <RecordActionMenu
            recordId={record.id}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </View>

      {/* 내용 */}
      <CustomText style={styles.content}>{record.content}</CustomText>

      {/* 이미지 */}
      <RecordImageView images={record.images || []} isExpanded={isExpanded} />
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors[theme].GRAY_200,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    profileSection: {
      flexDirection: 'row',
      flex: 1,
      gap: 12,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors[theme].GRAY_200,
    },
    defaultProfileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors[theme].GRAY_200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileInfo: {
      flex: 1,
      gap: 4,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    nickname: {
      fontSize: 16,
      fontWeight: '600',
      color: colors[theme][100],
    },
    badgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    badgeText: {
      fontSize: 12,
      color: colors[theme].GRAY_500,
    },
    lockIcon: {
      marginLeft: 2,
    },
    personIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      marginLeft: 4,
    },
    redDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors[theme].RED_500,
      marginRight: 2,
    },
    personCount: {
      fontSize: 12,
      color: colors[theme].GRAY_500,
    },
    date: {
      fontSize: 12,
      color: colors[theme].GRAY_500,
    },
    content: {
      fontSize: 14,
      color: colors[theme][100],
      lineHeight: 20,
      marginBottom: 12,
    },
  });

export default RecordCard;

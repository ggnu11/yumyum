import React from 'react';
import {View, StyleSheet} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from '../common/CustomText';
import RecordAuthorInfo from './RecordAuthorInfo';
import RecordActionMenu from './RecordActionMenu';
import RecordImageView from './RecordImageView';

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

  // visibility 배열에서 표시할 텍스트 생성
  const getVisibilityText = () => {
    if (!record.visibility || record.visibility.length === 0) {
      return '내 카드';
    }
    
    const visibilityLabels: Record<string, string> = {
      PRIVATE: '나만 보기',
      FRIEND: '친구',
      GROUP: record.groupName || '그룹',
    };
    
    // PRIVATE이 항상 포함되므로 제외하고 표시
    const visibleTypes = record.visibility.filter(v => v !== 'PRIVATE');
    if (visibleTypes.length === 0) {
      return '내 카드';
    }
    
    return visibleTypes.map(v => visibilityLabels[v] || v).join(', ');
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

  return (
    <View style={styles.container}>
      {/* 카드 헤더 */}
      <View style={styles.header}>
        {!record.isOwner && record.author ? (
          // 타인 핀 카드
          <View style={styles.authorContainer}>
            <RecordAuthorInfo author={record.author} />
            {record.originType && (
              <CustomText style={styles.originText}>
                {getOriginText()}
              </CustomText>
            )}
          </View>
        ) : (
          // 내 핀 카드
          <View style={styles.titleRow}>
            {record.placeName && (
              <CustomText style={styles.placeName}>
                {record.placeName}
              </CustomText>
            )}
            <View style={styles.categoryBadge}>
              <CustomText style={styles.categoryText}>
                {getVisibilityText()}
              </CustomText>
            </View>
          </View>
        )}

        {record.isOwner && (
          <RecordActionMenu
            recordId={record.id}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </View>

      <CustomText style={styles.date}>{record.date}</CustomText>

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
      marginBottom: 8,
    },
    titleRow: {
      flex: 1,
      flexDirection: 'column',
      gap: 4,
    },
    placeName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors[theme][100],
    },
    authorContainer: {
      flex: 1,
      gap: 4,
    },
    originText: {
      fontSize: 12,
      color: colors[theme].GRAY_500,
      marginTop: 4,
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    categoryText: {
      fontSize: 12,
      color: colors[theme].GRAY_500,
    },
    lockIcon: {
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lockText: {
      fontSize: 10,
    },
    date: {
      fontSize: 12,
      color: colors[theme].GRAY_500,
      marginBottom: 12,
    },
    content: {
      fontSize: 14,
      color: colors[theme][100],
      lineHeight: 20,
      marginBottom: 12,
    },
  });

export default RecordCard;

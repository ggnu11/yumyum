import React from 'react';
import {View, StyleSheet} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from '../common/CustomText';
import RecordAuthorInfo from './RecordAuthorInfo';
import RecordActionMenu from './RecordActionMenu';
import RecordImageView from './RecordImageView';

interface RecordData {
  id: number;
  title: string;
  content: string;
  date: string;
  images?: string[];
  isOwner: boolean;
  author?: {
    name: string;
    profileImage?: string;
  };
}

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

  return (
    <View style={styles.container}>
      {/* 카드 헤더 */}
      <View style={styles.header}>
        {!record.isOwner && record.author ? (
          <RecordAuthorInfo author={record.author} />
        ) : (
          <View style={styles.titleRow}>
            <CustomText style={styles.title}>{record.title}</CustomText>
            <View style={styles.categoryBadge}>
              <CustomText style={styles.categoryText}>내 카드</CustomText>
              {record.isOwner && (
                <View style={styles.lockIcon}>
                  <CustomText style={styles.lockText}>🔒</CustomText>
                </View>
              )}
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors[theme].BLACK,
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
      color: colors[theme].BLACK,
      lineHeight: 20,
      marginBottom: 12,
    },
  });

export default RecordCard;

import React from 'react';
import {View, StyleSheet} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import RecordAuthorInfo from './RecordAuthorInfo';
import RecordActionMenu from './RecordActionMenu';
import RecordImageView from './RecordImageView';
import RecordContent from './RecordContent';

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
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

function RecordCard({record, onEdit, onDelete}: RecordCardProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.container}>
      {/* 카드 헤더 */}
      <View style={styles.header}>
        {!record.isOwner && record.author && (
          <RecordAuthorInfo author={record.author} />
        )}

        {record.isOwner && (
          <RecordActionMenu
            recordId={record.id}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </View>

      {/* 이미지 */}
      <RecordImageView images={record.images || []} />

      {/* 카드 내용 */}
      <RecordContent
        title={record.title}
        content={record.content}
        date={record.date}
      />
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors[theme].WHITE,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors[theme].GRAY_200,
      shadowColor: colors[theme].BLACK,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
  });

export default RecordCard;
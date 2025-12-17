import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import {getDateWithSeparator} from '../../utils/date';
import CustomText from '../common/CustomText';

interface RecordContentProps {
  title: string;
  content: string;
  date: string;
}

function RecordContent({title, content, date}: RecordContentProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.content}>
      <CustomText style={styles.title}>{title}</CustomText>
      <CustomText style={styles.description}>{content}</CustomText>
      <CustomText style={styles.date}>
        {getDateWithSeparator(date, '.')}
      </CustomText>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors[theme][100],
    },
    description: {
      fontSize: 14,
      color: colors[theme].GRAY_700,
      lineHeight: 20,
    },
    date: {
      fontSize: 12,
      color: colors[theme].PINK_700,
      fontWeight: '500',
    },
  });

export default RecordContent;

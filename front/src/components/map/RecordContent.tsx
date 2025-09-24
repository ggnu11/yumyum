import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import {getDateWithSeparator} from '../../utils/date';

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
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{content}</Text>
      <Text style={styles.date}>{getDateWithSeparator(date, '.')}</Text>
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
      color: colors[theme].BLACK,
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

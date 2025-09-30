import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import {getDateWithSeparator} from '../../utils/date';
import CusmtomText from '../common/CustomText';

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
      <CusmtomText style={styles.title}>{title}</CusmtomText>
      <CusmtomText style={styles.description}>{content}</CusmtomText>
      <CusmtomText style={styles.date}>
        {getDateWithSeparator(date, '.')}
      </CusmtomText>
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

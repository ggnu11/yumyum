import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from '../common/CustomText';
import {TermsHeaderProps} from './types';

function TermsHeader({title}: TermsHeaderProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.header}>
      <CustomText style={styles.headerTitle}>{title}</CustomText>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: 30,
      paddingTop: 60,
      paddingBottom: 60,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '400',
      color: colors[theme].BLACK,
      lineHeight: 28,
    },
  });

export default TermsHeader;

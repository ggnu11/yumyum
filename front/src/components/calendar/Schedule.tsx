import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from '../common/CustomText';

interface ScheduleProps {
  subTitle: string;
  title: string;
  onPress: () => void;
}

function Schedule({subTitle, title, onPress}: ScheduleProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.line} />
      <View style={styles.infoContainer}>
        <CustomText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.subTitleText}>
          {subTitle}
        </CustomText>
        <CustomText style={styles.titleText}>{title}</CustomText>
      </View>
    </Pressable>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    line: {
      backgroundColor: colors[theme].PINK_700,
      width: 6,
      height: 50,
      marginRight: 8,
      borderRadius: 20,
    },
    infoContainer: {
      justifyContent: 'space-evenly',
    },
    subTitleText: {
      color: colors[theme].GRAY_500,
      fontSize: 13,
    },
    titleText: {
      color: colors[theme][100],
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default Schedule;

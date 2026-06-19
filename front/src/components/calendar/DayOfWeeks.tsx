import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

const deviceWidth = Dimensions.get('window').width;

function DayOfWeeks() {
  const {t} = useTranslation();
  const {theme} = useThemeStore();
  const styles = styling(theme);

  const days = [t('calendar.sun'), t('calendar.mon'), t('calendar.tue'), t('calendar.wed'), t('calendar.thu'), t('calendar.fri'), t('calendar.sat')];

  return (
    <View style={styles.container}>
      {days.map((dayOfWeek, index) => {
        return (
          <View key={index} style={styles.item}>
            <Text
              style={[
                styles.text,
                index === 6 && styles.saturdayText,
                index === 0 && styles.sundayText,
              ]}>
              {dayOfWeek}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    item: {
      width: deviceWidth / 7,
      alignItems: 'center',
    },
    text: {
      fontSize: 12,
      color: colors[theme].BLACK,
    },
    saturdayText: {
      color: colors[theme].BLUE_500,
    },
    sundayText: {
      color: colors[theme].RED_500,
    },
  });

export default DayOfWeeks;

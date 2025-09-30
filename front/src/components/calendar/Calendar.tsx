import {ResponseCalendarPost} from '@/api/post';
import {colors} from '@/constants/colors';
import useModal from '@/hooks/useModal';
import useThemeStore, {Theme} from '@/store/theme';
import {isSameAsCurrentDate, MonthYear} from '@/utils/date';
import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import CusmtomText from '../common/CustomText';
import DateBox from './DateBox';
import DayOfWeeks from './DayOfWeeks';
import YearSelector from './YearSelector';

interface CalendarProps {
  monthYear: MonthYear;
  onChangeMonth: (increment: number) => void;
  selectedDate: number;
  onPressDate: (date: number) => void;
  schedules: ResponseCalendarPost;
}

function Calendar({
  monthYear,
  onChangeMonth,
  selectedDate,
  onPressDate,
  schedules,
}: CalendarProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const {month, year, firstDOW, lastDate} = monthYear;

  const yearSelector = useModal();

  const handleChangeYear = (selectYear: number) => {
    onChangeMonth((selectYear - year) * 12);
    yearSelector.hide();
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Pressable style={styles.monthButton} onPress={() => onChangeMonth(-1)}>
          <Ionicons name="arrow-back" size={25} color={colors[theme].BLACK} />
        </Pressable>
        <Pressable
          style={styles.monthYearContainer}
          onPress={yearSelector.show}>
          <CusmtomText style={styles.monthYearText}>
            {year}년 {month}월
          </CusmtomText>
          <Ionicons
            name="chevron-down"
            size={20}
            color={colors[theme].GRAY_500}
          />
        </Pressable>
        <Pressable style={styles.monthButton} onPress={() => onChangeMonth(1)}>
          <Ionicons
            name="arrow-forward"
            size={25}
            color={colors[theme].BLACK}
          />
        </Pressable>
      </View>

      <DayOfWeeks />
      <View style={styles.bodyContainer}>
        <FlatList
          data={Array.from({length: lastDate + firstDOW}, (_, index) => ({
            id: index,
            date: index - firstDOW + 1,
          }))}
          renderItem={({item}) => (
            <DateBox
              date={item.date}
              isToday={isSameAsCurrentDate(year, month, item.date)}
              selectedDate={selectedDate}
              onPressDate={onPressDate}
              hasSchedule={Boolean(schedules[item.date])}
            />
          )}
          keyExtractor={item => String(item.id)}
          numColumns={7}
        />
      </View>

      <YearSelector
        isVisible={yearSelector.isVisible}
        currentyear={year}
        onChangeYear={handleChangeYear}
        hide={yearSelector.hide}
      />
    </>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 16,
    },
    monthYearContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    monthButton: {
      padding: 10,
    },
    monthYearText: {
      fontSize: 18,
      fontWeight: '500',
      color: colors[theme].BLACK,
    },
    bodyContainer: {
      backgroundColor: colors[theme].GRAY_100,
      borderBottomColor: colors[theme].GRAY_300,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });

export default Calendar;

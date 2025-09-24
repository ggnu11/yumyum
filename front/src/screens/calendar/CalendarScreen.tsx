import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import Calendar from '@/components/calendar/Calendar';
import Schedule from '@/components/calendar/Schedule';
import {colors} from '@/constants/colors';
import useGetCalendarPosts from '@/hooks/queries/useGetCalendarPosts';
import useThemeStore, {Theme} from '@/store/theme';
import {getMonthYearDetails, getNewMonthYear} from '@/utils/date';

function CalendarScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation();
  const currentMonthYear = getMonthYearDetails(new Date());
  const [monthYear, setMonthYear] = useState(currentMonthYear);
  const [selectedDate, setSelectedDate] = useState(0);
  const {data: posts} = useGetCalendarPosts(monthYear.year, monthYear.month);

  const moveToToday = () => {
    setSelectedDate(new Date().getDate());
    setMonthYear(getMonthYearDetails(new Date()));
  };

  const handleUpdateMonth = (increment: number) => {
    setSelectedDate(0);
    setMonthYear(prev => getNewMonthYear(prev, increment));
  };

  const handlePressSchedule = (postId: number) => {
    navigation.navigate('FeedTab', {
      screen: 'FeedDetail',
      params: {id: postId},
      initial: false,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={moveToToday} style={{paddingHorizontal: 10}}>
          <Text style={{color: colors[theme].PINK_700, fontWeight: 'bold'}}>
            오늘
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, moveToToday]);

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        monthYear={monthYear}
        schedules={posts ?? {}}
        onChangeMonth={handleUpdateMonth}
        selectedDate={selectedDate}
        onPressDate={(date: number) => setSelectedDate(date)}
      />
      <ScrollView
        style={styles.scheduleContainer}
        contentContainerStyle={{gap: 20}}>
        {posts?.[selectedDate]?.map(post => (
          <Schedule
            key={post.id}
            subTitle={post.address}
            title={post.title}
            onPress={() => handlePressSchedule(post.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme].WHITE,
    },
    scheduleContainer: {
      padding: 20,
      backgroundColor: colors[theme].WHITE,
    },
  });

export default CalendarScreen;

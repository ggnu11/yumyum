import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

import {colors, colorSystem} from '@/constants/colors';
import CalendarScreen from '@/screens/calendar/CalendarScreen';
import useThemeStore, {Theme} from '@/store/theme';
import useBottomSheetStore from '@/store/bottomSheet';
import {MainBottomTabParamList} from '@/types/navigation';
import {FeedStack} from './FeedNavigation';
import {MapStack} from './MapNavigation';
import {SettingStack} from './SettingNavigation';

const Tab = createBottomTabNavigator<MainBottomTabParamList>();

function TabIcons(routeName: keyof MainBottomTabParamList, focused: boolean) {
  let iconSource;

  switch (routeName) {
    case 'MapTab':
      iconSource = focused
        ? require('@/assets/bottom/active/pin_active.png')
        : require('@/assets/bottom/inactive/pin_inactive.png');
      break;
    case 'FeedTab':
      iconSource = focused
        ? require('@/assets/bottom/active/feed_active.png')
        : require('@/assets/bottom/inactive/feed_inactive.png');
      break;
    case 'CalendarTab':
      iconSource = focused
        ? require('@/assets/bottom/active/calendar_active.png')
        : require('@/assets/bottom/inactive/calendar_inactive.png');
      break;
    case 'MyTab':
      iconSource = focused
        ? require('@/assets/bottom/active/person_active.png')
        : require('@/assets/bottom/inactive/person_inactive.png');
      break;
    default:
      iconSource = require('@/assets/bottom/inactive/pin_inactive.png');
  }

  return (
    <Image
      source={iconSource}
      style={{width: 20, height: 20}}
      resizeMode="contain"
    />
  );
}

export default function BottomTabNavigation() {
  const {theme} = useThemeStore();
  const {isVisible: isBottomSheetVisible} = useBottomSheetStore();

  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: BottomTabScreenProps<MainBottomTabParamList>['route'];
      }) => ({
        tabBarIcon: ({focused}: {focused: boolean}) =>
          TabIcons(route.name as keyof MainBottomTabParamList, focused),
        tabBarActiveTintColor: colorSystem.label.normal,
        tabBarInactiveTintColor: colors[theme].GRAY_500,
        tabBarStyle: isBottomSheetVisible
          ? {display: 'none'}
          : {
              backgroundColor: colors[theme][0],
              borderTopColor: colors[theme].GRAY_200,
              paddingTop: 8,
              paddingBottom: 8,
              height: 100,
            },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          width: 72,
          height: 56,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="MapTab"
        component={MapStack}
        options={{
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen
        name="FeedTab"
        component={FeedStack}
        options={{
          tabBarLabel: '피드',
        }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarScreen}
        options={{
          tabBarLabel: '캘린더',
        }}
      />
      <Tab.Screen
        name="MyTab"
        component={SettingStack}
        options={{
          tabBarLabel: '마이',
        }}
      />
    </Tab.Navigator>
  );
}

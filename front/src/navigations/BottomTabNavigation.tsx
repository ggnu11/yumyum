import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

import {colors} from '@/constants/colors';
import CalendarScreen from '@/screens/calendar/CalendarScreen';
import useThemeStore, {Theme} from '@/store/theme';
import {MainBottomTabParamList} from '@/types/navigation';
import {FeedStack} from './FeedNavigation';
import {MapStack} from './MapNavigation';
import {SettingStack} from './SettingNavigation';

const Tab = createBottomTabNavigator<MainBottomTabParamList>();

type TabIconName = 'house' | 'book' | 'calendar' | 'user';

function TabIcons(
  routeName: keyof MainBottomTabParamList,
  focused: boolean,
  theme: Theme,
) {
  let iconName: TabIconName = 'house';

  switch (routeName) {
    case 'MapTab':
      iconName = 'house';
      break;
    case 'FeedTab':
      iconName = 'book';
      break;
    case 'CalendarTab':
      iconName = 'calendar';
      break;
    case 'MyTab':
      iconName = 'user';
      break;
  }

  return (
    <FontAwesome6
      name={iconName}
      iconStyle="solid"
      size={20}
      color={focused ? colors[theme].PINK_700 : colors[theme].GRAY_500}
    />
  );
}

export default function BottomTabNavigation() {
  const {theme} = useThemeStore();

  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: BottomTabScreenProps<MainBottomTabParamList>['route'];
      }) => ({
        tabBarIcon: ({focused}: {focused: boolean}) =>
          TabIcons(route.name as keyof MainBottomTabParamList, focused, theme),
        tabBarActiveTintColor: colors[theme].PINK_700,
        tabBarInactiveTintColor: colors[theme].GRAY_500,
        tabBarStyle: {
          backgroundColor: colors[theme].WHITE,
          borderTopColor: colors[theme].GRAY_200,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
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

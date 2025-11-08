import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import {colors} from '@/constants/colors';
import AddLocationScreen from '@/screens/map/AddLocationScreen';
import MapHomeScreen from '@/screens/map/MapHomeScreen';
import SearchLocationScreen from '@/screens/map/SearchLocationScreen';
import SearchScreen from '@/screens/map/SearchScreen';
import useThemeStore from '@/store/theme';
import {MapStackParamList} from '@/types/navigation';

const Stack = createStackNavigator<MapStackParamList>();

export function MapStack() {
  const {theme} = useThemeStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: colors[theme][100],
        headerStyle: {
          backgroundColor: colors[theme][0],
          shadowColor: colors[theme].GRAY_500,
        },
        headerTitleStyle: {
          fontSize: 16,
        },
      }}>
      <Stack.Screen
        name="MapHome"
        component={MapHomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddLocation"
        component={AddLocationScreen}
        options={{
          title: '장소 추가',
          cardStyle: {
            backgroundColor: colors[theme][0],
          },
        }}
      />
      <Stack.Screen
        name="SearchLocation"
        component={SearchLocationScreen}
        options={{
          title: '장소 검색',
          presentation: 'modal',
          cardStyle: {
            backgroundColor: colors[theme][0],
          },
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: colors[theme][0],
          },
        }}
      />
    </Stack.Navigator>
  );
}

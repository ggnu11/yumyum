import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {colors} from '@/constants/colors';
import AddLocationScreen from '@/screens/map/AddLocationScreen';
import MapHomeScreen from '@/screens/map/MapHomeScreen';
import SearchLocationScreen from '@/screens/map/SearchLocationScreen';
import useThemeStore from '@/store/theme';
import {MapStackParamList} from '@/types/navigation';

const Stack = createStackNavigator<MapStackParamList>();

export function MapStack() {
  const {t} = useTranslation();
  const {theme} = useThemeStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: colors[theme].BLACK,
        headerStyle: {
          backgroundColor: colors[theme].WHITE,
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
          title: t('navigation.addLocation'),
          cardStyle: {
            backgroundColor: colors[theme].WHITE,
          },
        }}
      />
      <Stack.Screen
        name="SearchLocation"
        component={SearchLocationScreen}
        options={{
          title: t('navigation.searchLocation'),
          presentation: 'modal',
          cardStyle: {
            backgroundColor: colors[theme].WHITE,
          },
        }}
      />
    </Stack.Navigator>
  );
}

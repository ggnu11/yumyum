import Ionicons from '@react-native-vector-icons/ionicons';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';

import {colors} from '@/constants/colors';
import useThemeStore from '@/store/theme';
import {MainDrawerParamList} from '@/types/navigation';

type Navigation = DrawerNavigationProp<MainDrawerParamList>;

interface DrawerButtonProps {
  color?: string;
  style?: StyleProp<ViewStyle>;
}

function DrawerButton({style, color}: DrawerButtonProps) {
  const navigation = useNavigation<Navigation>();
  const {theme} = useThemeStore();

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => navigation.openDrawer()}>
      <Ionicons name="menu" size={25} color={color ?? colors[theme][100]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
});

export default DrawerButton;

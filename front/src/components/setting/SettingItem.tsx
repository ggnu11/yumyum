import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import React from 'react';
import {Pressable, PressableProps, StyleSheet} from 'react-native';
import CustomText from '../common/CustomText';

interface SettingItemProps extends PressableProps {
  title: string;
  color?: string;
}

function SettingItem({title, color, ...props}: SettingItemProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <Pressable
      {...props}
      style={({pressed}) => [
        styles.container,
        pressed && styles.pressedContainer,
      ]}>
      <CustomText
        style={[styles.titleText, {color: color ?? colors[theme][100]}]}>
        {title}
      </CustomText>
    </Pressable>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
      padding: 15,
      backgroundColor: colors[theme][0],
      borderColor: colors[theme].GRAY_200,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    pressedContainer: {
      backgroundColor: colors[theme].GRAY_200,
    },
    titleText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors[theme][100],
    },
  });

export default SettingItem;

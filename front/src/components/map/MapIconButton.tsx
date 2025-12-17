import React from 'react';
import {Pressable, StyleSheet, Image} from 'react-native';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';

interface MapIconButtonProps {
  onPress: () => void;
}

function MapIconButton({onPress}: MapIconButtonProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <Pressable style={styles.mapButton} onPress={onPress}>
      <Image
        source={require('@/assets/location.png')}
        style={styles.iconImage}
      />
    </Pressable>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    mapButton: {
      backgroundColor: colors[theme][0],
      marginVertical: 5,
      height: 50,
      width: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors[theme][100],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    iconImage: {
      width: 24,
      height: 24,
      tintColor: colors[theme][100],
    },
  });

export default MapIconButton;

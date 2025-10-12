import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import {colors, colorSystem} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from '../common/CustomText';

interface SearchBarProps {
  onPress: () => void;
}

function SearchBar({onPress}: SearchBarProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const inset = useSafeAreaInsets();

  return (
    <View style={[styles.container, {top: inset.top + 10}]}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchInputContainer}>
          <CustomText style={styles.placeholder}>
            오늘 하루는 어떤 맛이었나요?
          </CustomText>
        </View>
        <TouchableOpacity
          style={styles.searchButtonTouchable}
          activeOpacity={0.8}
          onPress={onPress}>
          <LinearGradient
            colors={colorSystem.primary.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.searchButton}>
            <FontAwesome6
              name="magnifying-glass"
              size={18}
              color={colors[theme].WHITE}
              iconStyle="solid"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 1,
      alignItems: 'center',
    },
    searchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 0,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors[theme].WHITE,
      width: 335,
      height: 42,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: '#9A77FF',
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      borderRightWidth: 0,
    },
    searchButtonTouchable: {
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      overflow: 'hidden',
    },
    searchButton: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholder: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
      flex: 1,
    },
  });

export default SearchBar;

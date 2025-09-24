import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';

interface SearchBarProps {
  onPress: () => void;
}

function SearchBar({onPress}: SearchBarProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const inset = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[styles.container, {top: inset.top + 10}]}
      activeOpacity={0.8}
      onPress={onPress}>
      <View style={styles.searchBox}>
        <FontAwesome6
          name="magnifying-glass"
          size={16}
          color={colors[theme].GRAY_500}
          iconStyle="solid"
        />
        <Text style={styles.placeholder}>찾고 싶은 맛집을 검색해주세요</Text>
      </View>
    </TouchableOpacity>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: 15,
      right: 15,
      zIndex: 1,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors[theme].WHITE,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 25,
      shadowColor: colors[theme].BLACK,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    placeholder: {
      marginLeft: 10,
      fontSize: 14,
      color: colors[theme].GRAY_500,
      flex: 1,
    },
  });

export default SearchBar;

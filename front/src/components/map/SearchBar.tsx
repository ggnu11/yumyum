import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, {useRef} from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import {colors, colorSystem} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';

interface SearchBarProps {
  onSubmit: (keyword: string) => void;
  onFocus?: () => void;
}

function SearchBar({onSubmit, onFocus}: SearchBarProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const inset = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleSubmit = () => {
    // 검색바에서는 직접 검색하지 않고, SearchScreen에서 처리
    Keyboard.dismiss();
  };

  const handleSearchButtonPress = () => {
    // 검색 버튼 클릭 시 포커스
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, {top: inset.top + 10}]}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchInputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="오늘 하루는 어떤 맛이었나요?"
            placeholderTextColor={colors[theme].GRAY_500}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
            onFocus={handleFocus}
            maxLength={40}
          />
        </View>
        <TouchableOpacity onPress={handleSearchButtonPress} activeOpacity={0.8}>
          <LinearGradient
            colors={colorSystem.primary.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.searchButton}>
            <FontAwesome6
              name="magnifying-glass"
              size={18}
              color={colors[theme][0]}
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
      zIndex: 2,
      alignItems: 'center',
    },
    searchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 0,
      width: '100%',
      paddingHorizontal: 20,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors[theme][0],
      flex: 1,
      height: 42,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: '#9A77FF',
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      borderRightWidth: 0,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: colors[theme][100],
      padding: 0,
    },
    searchButton: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    },
  });

export default SearchBar;

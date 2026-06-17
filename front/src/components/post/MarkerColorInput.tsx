import {colors} from '@/constants/colors';
import {MARKER_CATEGORIES, MarkerCategory} from '@/constants/markerIcons';
import useThemeStore, {Theme} from '@/store/theme';
import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import FoodMarker from '../common/FoodMarker';

interface MarkerColorInputProps {
  color: string;
  score: number;
  onChangeColor: (value: string) => void;
}

function MarkerColorInput({
  color,
  score,
  onChangeColor,
}: MarkerColorInputProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.markerLabel}>마커선택</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.markerInputScroll}>
          {MARKER_CATEGORIES.map(({key, label}) => {
            const isSelected = color === key;
            return (
              <Pressable
                key={key}
                style={[
                  styles.markerBox,
                  isSelected && styles.pressedMarker,
                ]}
                onPress={() => onChangeColor(key)}>
                <View
                  style={[
                    styles.markerWrapper,
                    isSelected && styles.selectedScale,
                  ]}>
                  <FoodMarker category={key as MarkerCategory} score={score} size={38} />
                </View>
                {isSelected && <View style={styles.selectedBadge} />}
                <Text style={[styles.markerText, isSelected && styles.markerTextSelected]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors[theme].BORDER,
      padding: 15,
      borderRadius: 8,
    },
    markerInputScroll: {
      flexDirection: 'row',
      gap: 16,
    },
    markerLabel: {
      marginBottom: 15,
      color: colors[theme].GRAY_700,
      fontWeight: '600',
    },
    markerBox: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      height: 72,
      borderRadius: 10,
      backgroundColor: colors[theme].GRAY_100,
      position: 'relative',
    },
    pressedMarker: {
      borderWidth: 2,
      borderColor: colors[theme].PRIMARY,
      backgroundColor: colors[theme].BG_SOFT,
    },
    markerWrapper: {
      width: 38,
      height: 38,
    },
    selectedScale: {
      transform: [{scale: 1.06}],
    },
    selectedBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors[theme].PRIMARY,
    },
    markerText: {
      fontSize: 10,
      color: colors[theme].GRAY_500,
      marginTop: 2,
    },
    markerTextSelected: {
      color: colors[theme].PRIMARY_DARK,
      fontWeight: '600',
    },
  });

export default MarkerColorInput;

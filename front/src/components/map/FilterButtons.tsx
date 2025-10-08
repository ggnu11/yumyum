import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from '../common/CustomText';

interface FilterButtonsProps {
  activeFilters: string[];
  onFilterPress: (filter: string) => void;
}

const filterData = [
  {id: 'all', label: '모두 보기', color: 'transparent'},
  {id: 'wish', label: '위시', color: 'transparent'},
  {id: 'private', label: '나만 보기', color: 'transparent'},
  {id: 'friends', label: '친구', color: 'transparent'},
  {id: 'group1', label: '그룹1', color: '#ED6029'},
  {id: 'group2', label: '그룹2', color: '#FFB84D'},
  {id: 'group3', label: '그룹3', color: '#4ECDC4'},
  {id: 'group4', label: '그룹4', color: '#A8E6CF'},
  {id: 'group5', label: '그룹5', color: '#5DADE2'},
];

function FilterButtons({activeFilters, onFilterPress}: FilterButtonsProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const inset = useSafeAreaInsets();

  return (
    <View style={[styles.container, {top: inset.top + 70}]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {filterData.map(filter => {
          const isActive = activeFilters.includes(filter.id);
          const isGroupFilter = filter.id.startsWith('group');

          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                isActive && styles.activeFilterButton,
                isGroupFilter && {backgroundColor: filter.color},
                isGroupFilter && isActive && styles.activeGroupButton,
              ]}
              onPress={() => onFilterPress(filter.id)}
              activeOpacity={0.7}>
              <CustomText
                style={[
                  styles.filterText,
                  isActive && styles.activeFilterText,
                  isGroupFilter && isActive && styles.activeGroupText,
                ]}>
                {filter.label}
              </CustomText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
      paddingHorizontal: 15,
    },
    scrollContent: {
      paddingRight: 15,
    },
    filterButton: {
      backgroundColor: colors[theme].WHITE,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors[theme].GRAY_300,
      shadowColor: colors[theme].BLACK,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    activeFilterButton: {
      backgroundColor: colors[theme].BLUE_500,
      borderColor: colors[theme].BLUE_500,
    },
    activeGroupButton: {
      opacity: 0.9,
      borderWidth: 2,
      borderColor: colors[theme].WHITE,
    },
    filterText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors[theme].GRAY_700,
    },
    activeFilterText: {
      color: colors[theme].WHITE,
    },
    activeGroupText: {
      color: colors[theme].WHITE,
      fontWeight: '700',
    },
  });

export default FilterButtons;

import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {colors, colorSystem} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from '../common/CustomText';
import {
  StarIcon,
  LockIcon,
  UsersIcon,
  UserGroupIcon,
  ColorDot,
} from '../common/icons';

interface FilterButtonsProps {
  activeFilters: string[];
  onFilterPress: (filter: string) => void;
}

const filterData = [
  {id: 'all', label: '모두 보기', icon: null},
  {id: 'wish', label: '위시', icon: StarIcon},
  {id: 'private', label: '나만 보기', icon: LockIcon},
  {id: 'friends', label: '친구', icon: UsersIcon},
  {
    id: 'group1',
    label: '그룹이름',
    color: colorSystem.pin.red,
    icon: UserGroupIcon,
  },
  {
    id: 'group2',
    label: '그룹이름',
    color: colorSystem.pin.yellow,
    icon: UserGroupIcon,
  },
  {
    id: 'group3',
    label: '그룹이름',
    color: colorSystem.pin.yellowGreen,
    icon: UserGroupIcon,
  },
  {
    id: 'group4',
    label: '그룹이름',
    color: colorSystem.pin.teal,
    icon: UserGroupIcon,
  },
  {
    id: 'group5',
    label: '그룹이름',
    color: colorSystem.pin.blue,
    icon: UserGroupIcon,
  },
];

function FilterButtons({activeFilters, onFilterPress}: FilterButtonsProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const inset = useSafeAreaInsets();

  return (
    <View style={[styles.container, {top: inset.top + 65}]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {filterData.map(filter => {
          const isActive = activeFilters.includes(filter.id);
          const isGroupFilter = filter.id.startsWith('group');
          const IconComponent = filter.icon;

          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                isActive && styles.activeFilterButton,
              ]}
              onPress={() => onFilterPress(filter.id)}
              activeOpacity={0.7}>
              <View style={styles.buttonContent}>
                {isGroupFilter ? (
                  <ColorDot size={12} color={filter.color || '#000'} />
                ) : (
                  IconComponent && (
                    <IconComponent
                      size={12}
                      color={
                        isActive
                          ? colors[theme].WHITE
                          : colors[theme].GRAYSCALE_70
                      }
                    />
                  )
                )}
                <CustomText
                  style={[
                    styles.filterText,
                    isActive && styles.activeFilterText,
                    (IconComponent || isGroupFilter) && {marginLeft: 4},
                  ]}>
                  {filter.label}
                </CustomText>
              </View>
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
    },
    scrollContent: {
      paddingLeft: 13,
      paddingRight: 20,
    },
    filterButton: {
      backgroundColor: colors[theme].WHITE,
      height: 29,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      paddingHorizontal: 10,
      borderColor: colors[theme].GRAY_200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeFilterButton: {
      backgroundColor: colors[theme].GRAYSCALE_70,
      borderColor: colors[theme].GRAYSCALE_70,
    },
    filterText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors[theme].GRAYSCALE_70,
    },
    activeFilterText: {
      color: colors[theme].WHITE,
      fontWeight: '600',
    },
  });

export default FilterButtons;

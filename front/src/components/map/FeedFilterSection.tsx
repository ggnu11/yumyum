import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';

export type FilterType = 'mine' | 'all';

interface FeedFilterSectionProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

function FeedFilterSection({
  activeFilter,
  onFilterChange,
}: FeedFilterSectionProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.feedFilterSection}>
      <Text style={styles.feedTitle}>기록 피드</Text>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'mine' && styles.activeFilter,
          ]}
          onPress={() => onFilterChange('mine')}>
          <Text
            style={[
              styles.filterText,
              activeFilter === 'mine' && styles.activeFilterText,
            ]}>
            나만 보기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && styles.activeFilter,
          ]}
          onPress={() => onFilterChange('all')}>
          <Text
            style={[
              styles.filterText,
              activeFilter === 'all' && styles.activeFilterText,
            ]}>
            모두 보기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    feedFilterSection: {
      marginBottom: 20,
    },
    feedTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors[theme].BLACK,
      marginBottom: 12,
    },
    filterButtons: {
      flexDirection: 'row',
      backgroundColor: colors[theme].GRAY_100,
      borderRadius: 8,
      padding: 2,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignItems: 'center',
    },
    activeFilter: {
      backgroundColor: colors[theme].WHITE,
      shadowColor: colors[theme].BLACK,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    filterText: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
    },
    activeFilterText: {
      color: colors[theme].BLACK,
      fontWeight: '600',
    },
  });

export default FeedFilterSection;

import React, {useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import useSearchStore from '@/store/search';
import CustomText from '../common/CustomText';
import SearchResultItem from './SearchResultItem';
import DeleteSearchHistoryModal from './DeleteSearchHistoryModal';
import {RegionInfo} from '@/hooks/useSearchLocation';

interface SearchOverlayProps {
  keyword: string;
  searchResults: RegionInfo[];
  onSelectSearch: (keyword: string) => void;
  onSelectPlace: (place: RegionInfo) => void;
}

function SearchOverlay({
  keyword,
  searchResults,
  onSelectSearch,
  onSelectPlace,
}: SearchOverlayProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const inset = useSafeAreaInsets();
  const {recentSearches, clearRecentSearches} = useSearchStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteHistory = () => {
    clearRecentSearches();
    setShowDeleteModal(false);
  };

  const showRecentSearches = keyword === '' && recentSearches.length > 0;
  const showEmptyState = keyword === '' && recentSearches.length === 0;
  const showSearchResults = keyword !== '' && searchResults.length > 0;

  return (
    <>
      <View style={[styles.container, {paddingTop: inset.top + 60}]}>
        {showRecentSearches && (
          <>
            <View style={styles.header}>
              <CustomText style={styles.title}>최근 검색</CustomText>
              <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                <CustomText style={styles.clearText}>검색 기록 삭제</CustomText>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView}>
              {recentSearches.map((search, index) => (
                <SearchResultItem
                  key={index}
                  type="recent"
                  keyword={search}
                  onPress={() => onSelectSearch(search)}
                />
              ))}
            </ScrollView>
          </>
        )}
        {showEmptyState && (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>
              최근 검색어가 없어요
            </CustomText>
          </View>
        )}
        {showSearchResults && (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({item}) => (
              <SearchResultItem
                type="place"
                placeInfo={{
                  ...item,
                  distance: item.distance,
                }}
                onPress={() => onSelectPlace(item)}
              />
            )}
            style={styles.scrollView}
          />
        )}
      </View>
      <DeleteSearchHistoryModal
        visible={showDeleteModal}
        onConfirm={handleDeleteHistory}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors[theme].WHITE,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    title: {
      fontSize: 14,
      color: colors[theme].GRAY_900,
    },
    clearText: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
    },
    scrollView: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
    },
  });

export default SearchOverlay;

import Ionicons from '@react-native-vector-icons/ionicons';
import React, {useState} from 'react';
import useDebounce from '@/hooks/useDebounce';
import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {colors, colorSystem} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import useSearchStore from '@/store/search';
import useSearchLocation from '@/hooks/useSearchLocation';
import useUserLocation from '@/hooks/useUserLocation';
import useLocationStore from '@/store/location';
import CustomText from '@/components/common/CustomText';
import SearchResultItem from '@/components/map/SearchResultItem';
import DeleteSearchHistoryModal from '@/components/map/DeleteSearchHistoryModal';
import {RegionInfo} from '@/hooks/useSearchLocation';
import {MapStackParamList} from '@/types/navigation';

type Navigation = StackNavigationProp<MapStackParamList>;

interface SearchScreenProps {
  onClose?: () => void;
}

function SearchScreen({onClose}: SearchScreenProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();
  const inset = useSafeAreaInsets();
  const [keyword, setKeyword] = useState('');
  const {recentSearches, clearRecentSearches, addRecentSearch} =
    useSearchStore();
  const {userLocation} = useUserLocation();
  const {setSelectedPlaceFromSearch} = useLocationStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // debounce 적용 (300ms 지연) - 사용자가 입력을 멈춘 후에만 검색
  const debouncedKeyword = useDebounce(keyword.trim(), 300);

  // 실시간 검색 (최대 10개) - debouncedKeyword가 있을 때만 검색
  const {regionInfo} = useSearchLocation(
    debouncedKeyword || '',
    userLocation,
  );
  const searchResults = debouncedKeyword ? regionInfo.slice(0, 10) : [];

  const handleBackPress = () => {
    if (onClose) {
      onClose();
    } else {
      navigation.navigate('MapHome');
    }
  };

  const handleSubmit = () => {
    if (keyword.trim()) {
      addRecentSearch(keyword.trim());
      Keyboard.dismiss();
    }
  };

  const handleSelectRecentSearch = (selectedKeyword: string) => {
    setKeyword(selectedKeyword);
  };

  const handleSelectPlace = (place: RegionInfo) => {
    addRecentSearch(place.place_name);
    setSelectedPlaceFromSearch(place);
    if (onClose) {
      onClose();
    } else {
      navigation.navigate('MapHome');
    }
  };

  const handleDeleteHistory = () => {
    clearRecentSearches();
    setShowDeleteModal(false);
  };

  const handleChangeText = (text: string) => {
    // 최대 40자 제한
    if (text.length <= 40) {
      setKeyword(text);
    }
  };

  // 표시 조건: keyword가 비어있으면 최근 검색어, debouncedKeyword가 있으면 검색 결과
  const showRecentSearches = keyword === '' && recentSearches.length > 0;
  const showEmptyState = keyword === '' && recentSearches.length === 0;
  const showSearchResults = debouncedKeyword !== '' && searchResults.length > 0;
  const showSearchEmpty = debouncedKeyword !== '' && searchResults.length === 0;

  return (
    <>
      <View style={[styles.container, {paddingTop: inset.top}]}>
        {/* 검색바 */}
        <View style={[styles.searchBarContainer, {top: inset.top + 10}]}>
          <View style={styles.searchWrapper}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors[theme].BLACK}
              />
            </TouchableOpacity>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.input}
                value={keyword}
                onChangeText={handleChangeText}
                placeholder="오늘 하루는 어떤 맛이었나요?"
                placeholderTextColor={colors[theme].GRAY_500}
                returnKeyType="search"
                onSubmitEditing={handleSubmit}
                autoFocus
                maxLength={40}
              />
            </View>
            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}>
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

        {/* 컨텐츠 영역 */}
        <View style={[styles.contentContainer, {paddingTop: inset.top + 62}]}>
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
                    onPress={() => handleSelectRecentSearch(search)}
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
                  onPress={() => handleSelectPlace(item)}
                />
              )}
              style={styles.scrollView}
            />
          )}
          {showSearchEmpty && (
            <View style={styles.emptyContainer}>
              <CustomText style={styles.emptyText}>
                검색 결과가 없어요
              </CustomText>
            </View>
          )}
        </View>
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
      flex: 1,
      backgroundColor: colors[theme].WHITE,
    },
    searchBarContainer: {
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
    backButton: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors[theme].WHITE,
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
      color: colors[theme].BLACK,
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
    contentContainer: {
      flex: 1,
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

export default SearchScreen;


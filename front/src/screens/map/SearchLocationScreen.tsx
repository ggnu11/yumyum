import React, {useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';

import Pagination from '@/components/map/Pagination';
import SearchInput from '@/components/map/SearchInput';
import SearchRegionResult from '@/components/map/SearchRegionResult';
import useSearchLocation from '@/hooks/useSearchLocation';
import useUserLocation from '@/hooks/useUserLocation';
import useLocationStore from '@/store/location';

function SearchLocationScreen() {
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const {userLocation} = useUserLocation();
  const {setSelectedPlaceFromSearch} = useLocationStore();
  const {regionInfo, pageParam, fetchNextPage, fetchPrevPage, hasNextPage} =
    useSearchLocation(searchKeyword, userLocation);

  const handleSubmitKeyword = () => {
    // 새로운 검색 시 이전 선택 상태 초기화
    setSelectedPlaceFromSearch(null);
    setSearchKeyword(keyword);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <SearchInput
        autoFocus
        value={keyword}
        onChangeText={setKeyword}
        onSubmit={handleSubmitKeyword}
        placeholder="오늘 하루는 어떤 맛이었나요?"
      />
      <SearchRegionResult regionInfo={regionInfo} />
      <Pagination
        pageParam={pageParam}
        fetchNextPage={fetchNextPage}
        fetchPrevPage={fetchPrevPage}
        hasNextPage={hasNextPage}
        totalLength={regionInfo.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 15,
  },
});

export default SearchLocationScreen;

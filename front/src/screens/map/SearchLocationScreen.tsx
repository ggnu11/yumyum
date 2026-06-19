import React, {useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Pagination from '@/components/map/Pagination';
import SearchInput from '@/components/map/SearchInput';
import SearchRegionResult from '@/components/map/SearchRegionResult';
import useSearchLocation from '@/hooks/useSearchLocation';
import useUserLocation from '@/hooks/useUserLocation';

function SearchLocationScreen() {
  const {t} = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const {userLocation} = useUserLocation();
  const {regionInfo, pageParam, fetchNextPage, fetchPrevPage, hasNextPage} =
    useSearchLocation(searchKeyword, userLocation);

  const handleSubmitKeyword = () => {
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
        placeholder={t('map.searchPlaceholder')}
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

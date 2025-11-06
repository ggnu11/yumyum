import BottomSheet from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import MapView from 'react-native-map-clustering';
import {LatLng, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {getCombinedPlaceInfo} from '@/api/kakao';
import CustomMarker from '@/components/common/CustomMarker';
import FilterButtons from '@/components/map/FilterButtons';
import MapIconButton from '@/components/map/MapIconButton';
import MarkerFilterAction from '@/components/map/MarkerFilterAction';
import SearchBar from '@/components/map/SearchBar';
import {colors} from '@/constants/colors';
import {numbers} from '@/constants/numbers';
import useGetMarkers from '@/hooks/queries/useGetMarkers';
import useModal from '@/hooks/useModal';
import useMoveMapView from '@/hooks/useMoveMapView';
import usePermission from '@/hooks/usePermission';
import useUserLocation from '@/hooks/useUserLocation';
import useBottomSheetStore from '@/store/bottomSheet';
import useFilterStore from '@/store/filter';
import useLocationStore from '@/store/location';
import useThemeStore, {Theme} from '@/store/theme';
import {PlaceInfo as ApiPlaceInfo} from '@/types/api';
import {MapStackParamList} from '@/types/navigation';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AddRecordFloatingButton from '../../components/map/AddRecordFloatingButton';
import PlaceBottomSheet from '../../components/map/PlaceBottomSheet';
import RecordFilterBottomSheet from '../../components/map/RecordFilterBottomSheet';
import SearchScreen from './SearchScreen';

type Navigation = StackNavigationProp<MapStackParamList>;

function MapHomeScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();
  const inset = useSafeAreaInsets();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedPlaceInfo, setSelectedPlaceInfo] =
    useState<ApiPlaceInfo | null>(null);
  const [selectedPlaceCoordinate, setSelectedPlaceCoordinate] =
    useState<LatLng | null>(null); // 검색으로 선택한 장소의 좌표
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false); // 버튼 표시 상태 추가
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] =
    useState<boolean>(false); // 바텀시트 100% 확장 상태
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
  const [isSearchMode, setIsSearchMode] = useState(false); // 검색 모드 상태
  const searchBarTranslateY = useRef(new Animated.Value(0)).current; // 검색바 애니메이션
  const bottomSheetRef = useRef<BottomSheet>(null);
  const filterBottomSheetRef = useRef<BottomSheet>(null);
  const {selectedPlaceFromSearch, setSelectedPlaceFromSearch} =
    useLocationStore();
  const {filters} = useFilterStore();
  const {setIsVisible: setBottomSheetVisible} = useBottomSheetStore();
  const {userLocation, isUserLocationError} = useUserLocation();
  const {mapRef, moveMapView, moveMapViewWithOffset, handleChangeDelta} =
    useMoveMapView();
  const {data: markers = []} = useGetMarkers({
    select: data => {
      let filteredData = data.filter(
        marker =>
          filters[marker.color] === true &&
          filters[String(marker.score)] === true,
      );

      // 추가 필터링 로직 (임시 구현)
      if (!activeFilters.includes('all')) {
        // 실제 구현에서는 백엔드에서 필터링된 데이터를 받아야 함
        // 현재는 모든 마커를 표시하는 임시 로직
        filteredData = data.filter(
          marker =>
            filters[marker.color] === true &&
            filters[String(marker.score)] === true,
        );
      }

      return filteredData;
    },
  });
  const filterAction = useModal();
  usePermission('LOCATION');

  // 검색에서 선택된 장소가 있을 때 바텀시트 표시
  useEffect(() => {
    if (selectedPlaceFromSearch) {
      const convertedPlaceInfo = {
        place_id: selectedPlaceFromSearch.id,
        place_name: selectedPlaceFromSearch.place_name,
        address:
          selectedPlaceFromSearch.road_address_name ||
          selectedPlaceFromSearch.address_name,
        phone_number: selectedPlaceFromSearch.phone || '',
        total_pin_count: 0, // 검색 결과에서는 0으로 설정
      };

      const coordinate = {
        latitude: Number(selectedPlaceFromSearch.y),
        longitude: Number(selectedPlaceFromSearch.x),
      };

      setSelectedPlaceId(selectedPlaceFromSearch.id);
      setSelectedPlaceInfo(convertedPlaceInfo);
      setSelectedPlaceCoordinate(coordinate); // 좌표 저장
      setIsButtonVisible(true); // 버튼 즉시 표시
      setBottomSheetVisible(true); // 탭바 즉시 숨김
      moveMapViewWithOffset(coordinate);
      bottomSheetRef.current?.snapToIndex(0);

      // 사용 후 초기화
      setSelectedPlaceFromSearch(null);
    }
  }, [
    selectedPlaceFromSearch,
    moveMapViewWithOffset,
    setSelectedPlaceFromSearch,
  ]);

  const handlePressUserLocation = () => {
    if (isUserLocationError) {
      Toast.show({
        type: 'error',
        text1: '위치 권한을 허용해주세요.',
        position: 'bottom',
      });
      return;
    }

    moveMapView(userLocation);
  };

  const handlePressMarker = useCallback(
    async (id: number, coordinate: LatLng) => {
      const placeId = `place_${id}`;

      // 카카오 API로 장소 정보 조회 (백엔드 연동 후 활성화)
      // try {
      //   const placeInfo = await getPlaceInfo(placeId);
      //   setSelectedPlaceInfo(placeInfo);
      // } catch (error) {
      //   console.error('장소 정보 조회 실패:', error);
      //   Alert.alert('오류', '장소 정보를 불러올 수 없습니다.');
      //   return;
      // }

      // 임시 데이터 - 카카오 API로만 구성
      const mockPlaceInfo = {
        place_id: placeId,
        place_name: '엄마손칼국수', // 카카오 API에서 가져온 상호명
        address: '대전 서구 문정로 64', // 카카오 API 주소
        phone_number: '042-489-4900', // 카카오 API 전화번호 (복사 기능)
        total_pin_count: 2, // 백엔드에서 계산된 기록 카드 수
      };

      setSelectedPlaceId(placeId);
      setSelectedPlaceInfo(mockPlaceInfo);
      moveMapViewWithOffset(coordinate);
      bottomSheetRef.current?.snapToIndex(0);
    },
    [moveMapView],
  );

  // 구글맵 POI(장소) 클릭 처리 - 구글과 카카오 API 조합으로 정확한 장소 정보 조회
  const handlePressMapPoi = useCallback(
    async (event: any) => {
      const {coordinate, name, placeId} = event.nativeEvent;

      if (!coordinate) {
        return;
      }

      try {
        // 구글과 카카오 API를 조합하여 최적의 장소 정보 가져오기
        const placeInfo = await getCombinedPlaceInfo(placeId, coordinate, name);

        setSelectedPlaceId(placeInfo.place_id);
        setSelectedPlaceInfo(placeInfo);
        setIsButtonVisible(true); // 버튼 즉시 표시
        setBottomSheetVisible(true); // 탭바 즉시 숨김
        moveMapViewWithOffset(coordinate);
        bottomSheetRef.current?.snapToIndex(0);
      } catch (error) {
        const fallbackPlaceInfo = {
          place_id: placeId || `google_${Date.now()}`,
          place_name: name || '알 수 없는 장소',
          address: '주소 정보 없음',
          phone_number: '',
          total_pin_count: 0,
        };

        setSelectedPlaceId(fallbackPlaceInfo.place_id);
        setSelectedPlaceInfo(fallbackPlaceInfo);
        setIsButtonVisible(true); // 버튼 즉시 표시
        setBottomSheetVisible(true); // 탭바 즉시 숨김
        moveMapViewWithOffset(coordinate);
        bottomSheetRef.current?.snapToIndex(0);
      }
    },
    [moveMapViewWithOffset],
  );

  // 바텀시트 상태 변경 감지
  const handleBottomSheetChange = useCallback(
    (index: number) => {
      console.log('Bottom sheet index changed to:', index);
      // 바텀시트가 닫히기 시작하면 (-1) 또는 닫히는 과정에서 버튼을 즉시 숨김
      if (index === -1) {
        setIsButtonVisible(false);
        setBottomSheetVisible(false); // 탭바 표시
        setIsBottomSheetExpanded(false); // 검색창/필터바 표시
      }
      // 바텀시트가 100%로 확장되었을 때 (index === 1)
      else if (index === 1) {
        setIsButtonVisible(true);
        setBottomSheetVisible(true); // 탭바 숨김
        setIsBottomSheetExpanded(true); // 검색창/필터바 숨김
      }
      // 바텀시트가 기본 상태일 때 (index === 0)
      else if (index === 0) {
        setIsButtonVisible(true);
        setBottomSheetVisible(true); // 탭바 숨김
        setIsBottomSheetExpanded(false); // 검색창/필터바 표시
      }
    },
    [setBottomSheetVisible],
  );

  // 바텀시트 애니메이션 감지 - 애니메이션 시작 시 즉시 반영
  const handleBottomSheetAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      console.log('Bottom sheet animating from', fromIndex, 'to', toIndex);
      // 바텀시트가 닫히는 애니메이션이 시작되면 (toIndex가 -1) 버튼과 탭바를 즉시 변경
      if (toIndex === -1) {
        setIsButtonVisible(false);
        setBottomSheetVisible(false); // 탭바 표시
        setIsBottomSheetExpanded(false); // 검색창/필터바 표시
        // 검색바 다시 내려오기
        Animated.timing(searchBarTranslateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
      // 바텀시트가 100%로 확장되는 애니메이션이 시작되면 (toIndex === 1)
      else if (toIndex === 1) {
        setIsBottomSheetExpanded(true); // 검색창/필터바 숨김
        // 검색바 위로 올리기
        Animated.timing(searchBarTranslateY, {
          toValue: -200, // 검색바 + 필터바 높이만큼 위로
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
      // 바텀시트가 기본 상태로 돌아오는 애니메이션이 시작되면 (toIndex === 0)
      else if (toIndex === 0) {
        setIsBottomSheetExpanded(false); // 검색창/필터바 표시
        // 검색바 다시 내려오기
        Animated.timing(searchBarTranslateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
      // 바텀시트가 열리는 애니메이션이 시작되면 (toIndex >= 0) 버튼과 탭바를 즉시 변경
      if (toIndex >= 0 && fromIndex === -1) {
        setIsButtonVisible(true);
        setBottomSheetVisible(true); // 탭바 숨김
      }
    },
    [setBottomSheetVisible, searchBarTranslateY],
  );

  const handleCloseBottomSheet = useCallback(() => {
    // 버튼을 즉시 숨김 (바텀시트와 동시에 애니메이션 시작)
    setIsButtonVisible(false);
    setBottomSheetVisible(false); // 탭바 표시
    // 바텀시트를 부드럽게 닫기 (애니메이션 포함)
    bottomSheetRef.current?.close();
    // 검색으로 선택한 장소 정보 초기화
    setSelectedPlaceCoordinate(null);
  }, [setBottomSheetVisible]);

  // 바텀시트가 완전히 닫힌 후 상태 초기화
  const handleBottomSheetClosed = useCallback(() => {
    setSelectedPlaceId(null);
    setSelectedPlaceInfo(null);
    setSelectedPlaceCoordinate(null);
  }, []);

  const handleAddRecord = useCallback(() => {
    if (selectedPlaceInfo) {
      // 장소 정보를 기반으로 AddLocation 화면으로 이동
      navigation.navigate('AddLocation', {
        location: {
          latitude: 37.5665, // 임시 좌표
          longitude: 126.978,
        },
      });
      bottomSheetRef.current?.close();
    }
  }, [selectedPlaceInfo, navigation]);

  const handleEditRecord = useCallback((recordId: number) => {
    // 기록 수정 화면으로 이동
    console.log('기록 수정:', recordId);
    bottomSheetRef.current?.close();
  }, []);

  const handleDeleteRecord = useCallback((recordId: number) => {
    // 기록 삭제 처리
    console.log('기록 삭제:', recordId);
  }, []);

  // 필터 바텀시트 열기
  const handleOpenFilterSheet = useCallback(() => {
    filterBottomSheetRef.current?.snapToIndex(0);
  }, []);

  // 필터 적용
  const handleApplyFilter = useCallback((filters: string[]) => {
    setSelectedFilters(filters);
  }, []);

  const handleFilterPress = useCallback((filter: string) => {
    setActiveFilters(prevFilters => {
      if (filter === 'all') {
        // '모두 보기'를 선택하면 다른 필터들을 모두 해제
        return ['all'];
      } else {
        // 다른 필터를 선택하면 '모두 보기'를 해제하고 해당 필터를 토글
        const newFilters = prevFilters.filter(f => f !== 'all');
        if (newFilters.includes(filter)) {
          const filtered = newFilters.filter(f => f !== filter);
          return filtered.length === 0 ? ['all'] : filtered;
        } else {
          return [...newFilters, filter];
        }
      }
    });
  }, []);

  return (
    <>
      {!isSearchMode && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            transform: [{translateY: searchBarTranslateY}],
          }}>
          <SearchBar
            onSubmit={keyword => {
              setSelectedPlaceFromSearch(null);
              navigation.navigate('SearchLocation', {initialKeyword: keyword});
            }}
            onFocus={() => setIsSearchMode(true)}
          />
          <FilterButtons
            activeFilters={activeFilters}
            onFilterPress={handleFilterPress}
          />
        </Animated.View>
      )}
      <MapView
        userInterfaceStyle={theme}
        googleMapId="f727da01391db33238e04009"
        clusterColor="#ED6029"
        style={styles.container}
        ref={mapRef}
        region={{
          ...userLocation,
          ...numbers.INITIAL_DELTA,
        }}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={handleChangeDelta}
        onPress={handleCloseBottomSheet} // 지도 클릭 시 바텀시트 닫기
        onPoiClick={handlePressMapPoi}
        showsPointsOfInterests={true}>
        {markers.map(({id, color, score, ...coordinate}) => (
          <CustomMarker
            key={id}
            color={color}
            score={score}
            coordinate={coordinate}
            onPress={() => handlePressMarker(id, coordinate)}
          />
        ))}
        {/* 검색으로 선택한 장소의 마커 */}
        {selectedPlaceCoordinate && selectedPlaceInfo && (
          <CustomMarker
            key={`search-${selectedPlaceInfo.place_id}`}
            color={colors[theme].PINK_500}
            score={5}
            coordinate={selectedPlaceCoordinate}
            onPress={() => {
              moveMapViewWithOffset(selectedPlaceCoordinate);
              bottomSheetRef.current?.snapToIndex(0);
            }}
          />
        )}
      </MapView>
      <View style={styles.buttonList}>
        <MapIconButton onPress={handlePressUserLocation} />
      </View>

      <PlaceBottomSheet
        ref={bottomSheetRef}
        placeInfo={selectedPlaceInfo}
        onClose={handleBottomSheetClosed}
        onSheetChange={handleBottomSheetChange}
        onSheetAnimate={handleBottomSheetAnimate}
        onAddRecord={handleAddRecord}
        onEditRecord={handleEditRecord}
        onDeleteRecord={handleDeleteRecord}
        onOpenFilterSheet={handleOpenFilterSheet}
        selectedFilters={selectedFilters}
      />
      <AddRecordFloatingButton
        onPress={handleAddRecord}
        isVisible={isButtonVisible} // 별도 상태로 즉시 제어
      />
      <RecordFilterBottomSheet
        ref={filterBottomSheetRef}
        onApply={handleApplyFilter}
      />
      <MarkerFilterAction
        isVisible={filterAction.isVisible}
        hideAction={filterAction.hide}
      />
      {/* 검색 화면 오버레이 */}
      {isSearchMode && (
        <View style={styles.searchOverlay}>
          <SearchScreen onClose={() => setIsSearchMode(false)} />
        </View>
      )}
    </>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    buttonList: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      zIndex: 0,
    },
    searchOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors[theme].WHITE,
      zIndex: 100,
    },
  });

export default MapHomeScreen;

import React, {useState, useRef, useCallback} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BottomSheet from '@gorhom/bottom-sheet';
import MapView from 'react-native-map-clustering';

import CustomMarker from '@/components/common/CustomMarker';
import MapIconButton from '@/components/map/MapIconButton';
import MarkerFilterAction from '@/components/map/MarkerFilterAction';
import PlaceBottomSheet from '../../components/map/PlaceBottomSheet';
import SearchBar from '@/components/map/SearchBar';
import {getCombinedPlaceInfo} from '@/api/kakao';
import {numbers} from '@/constants/numbers';
import useGetMarkers from '@/hooks/queries/useGetMarkers';
import useModal from '@/hooks/useModal';
import useMoveMapView from '@/hooks/useMoveMapView';
import usePermission from '@/hooks/usePermission';
import useUserLocation from '@/hooks/useUserLocation';
import useFilterStore from '@/store/filter';
import useLocationStore from '@/store/location';
import useThemeStore, {Theme} from '@/store/theme';
import {MapStackParamList} from '@/types/navigation';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {getPlaceInfo} from '@/api/pin';
import {PlaceInfo as ApiPlaceInfo} from '@/types/api';

type Navigation = StackNavigationProp<MapStackParamList>;

function MapHomeScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();
  const inset = useSafeAreaInsets();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedPlaceInfo, setSelectedPlaceInfo] =
    useState<ApiPlaceInfo | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {selectLocation, setSelectLocation} = useLocationStore();
  const {filters} = useFilterStore();
  const {userLocation, isUserLocationError} = useUserLocation();
  const {mapRef, moveMapView, handleChangeDelta} = useMoveMapView();
  const {data: markers = []} = useGetMarkers({
    select: data =>
      data.filter(
        marker =>
          filters[marker.color] === true &&
          filters[String(marker.score)] === true,
      ),
  });
  const filterAction = useModal();
  usePermission('LOCATION');

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
      moveMapView(coordinate);
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
        moveMapView(coordinate);
        bottomSheetRef.current?.snapToIndex(0);
      } catch (error) {
        console.error('장소 정보 조회 실패:', error);

        const fallbackPlaceInfo = {
          place_id: placeId || `google_${Date.now()}`,
          place_name: name || '알 수 없는 장소',
          address: '주소 정보 없음',
          phone_number: '',
          total_pin_count: 0,
        };

        setSelectedPlaceId(fallbackPlaceInfo.place_id);
        setSelectedPlaceInfo(fallbackPlaceInfo);
        moveMapView(coordinate);
        bottomSheetRef.current?.snapToIndex(0);
      }
    },
    [moveMapView],
  );

  const handlePressAddPost = () => {
    if (!selectLocation) {
      Alert.alert(
        '추가할 위치를 선택해주세요',
        '지도를 길게 누르면 위치가 선택됩니다.',
      );
      return;
    }

    navigation.navigate('AddLocation', {
      location: selectLocation,
    });
    setSelectLocation(null);
  };

  const handleCloseBottomSheet = useCallback(() => {
    setSelectedPlaceId(null);
    setSelectedPlaceInfo(null);
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

  return (
    <>
      <SearchBar onPress={() => navigation.navigate('SearchLocation')} />
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
        onLongPress={({nativeEvent}) =>
          setSelectLocation(nativeEvent.coordinate)
        }
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

        {selectLocation && <Marker coordinate={selectLocation} />}
      </MapView>
      <View style={styles.buttonList}>
        <MapIconButton name="filter" onPress={filterAction.show} />
        <MapIconButton name="plus" onPress={handlePressAddPost} />
        <MapIconButton
          name="location-crosshairs"
          onPress={handlePressUserLocation}
        />
      </View>

      <PlaceBottomSheet
        ref={bottomSheetRef}
        placeInfo={selectedPlaceInfo}
        onClose={handleCloseBottomSheet}
        onAddRecord={handleAddRecord}
        onEditRecord={handleEditRecord}
        onDeleteRecord={handleDeleteRecord}
      />
      <MarkerFilterAction
        isVisible={filterAction.isVisible}
        hideAction={filterAction.hide}
      />
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
      zIndex: 1,
    },
  });

export default MapHomeScreen;

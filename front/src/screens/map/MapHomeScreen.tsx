import React, {useRef, useState} from 'react';
import {Alert, Animated, Easing, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import MapView, {LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import BannerAdView from '@/components/common/BannerAdView';
import CustomMarker from '@/components/common/CustomMarker';
import DrawerButton from '@/components/common/DrawerButton';
import MapIconButton from '@/components/map/MapIconButton';
import MarkerFilterAction from '@/components/map/MarkerFilterAction';
import MarkerModal from '@/components/map/MarkerModal';
import {colors} from '@/constants/colors';
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

type Navigation = StackNavigationProp<MapStackParamList>;

function MapHomeScreen() {
  const {t} = useTranslation();
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();
  const inset = useSafeAreaInsets();
  const [markerId, setSetMarkerId] = useState<number>();
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
  const markerModal = useModal();
  const filterAction = useModal();
  usePermission('LOCATION');

  const drawerAnim = useRef(new Animated.Value(1)).current;
  const fabAnim = useRef(new Animated.Value(1)).current;
  const isHidden = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideControls = () => {
    if (isHidden.current) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
      return;
    }
    isHidden.current = true;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fabAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showControls = () => {
    if (!isHidden.current) return;
    debounceTimer.current = setTimeout(() => {
      isHidden.current = false;
      Animated.parallel([
        Animated.timing(drawerAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fabAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 120);
  };

  const handlePanDrag = () => {
    hideControls();
  };

  const handleRegionChangeComplete = (region: any) => {
    handleChangeDelta(region);
    showControls();
  };

  const drawerTranslateX = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 0],
  });

  const fabTranslateX = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0],
  });

  const handlePressUserLocation = () => {
    if (isUserLocationError) {
      Toast.show({
        type: 'error',
        text1: t('map.locationPermission'),
        position: 'bottom',
      });
      return;
    }

    moveMapView(userLocation);
  };

  const handlePressMarker = (id: number, coordinate: LatLng) => {
    setSetMarkerId(id);
    moveMapView(coordinate);
    markerModal.show();
  };

  const handlePressAddPost = () => {
    if (!selectLocation) {
      Alert.alert(
        t('map.selectLocation'),
        t('map.longPressToSelect'),
      );
      return;
    }

    navigation.navigate('AddLocation', {
      location: selectLocation,
    });
    setSelectLocation(null);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.drawerButton,
          {top: inset.top + 10},
          {transform: [{translateX: drawerTranslateX}], opacity: drawerAnim},
        ]}>
        <DrawerButton color={colors[theme].WHITE} />
      </Animated.View>
      <MapView
        key={theme}
        userInterfaceStyle={theme}
        googleMapId="4ddb13ebf03d7ebc76229497"
        style={styles.container}
        ref={mapRef}
        region={{
          ...userLocation,
          ...numbers.INITIAL_DELTA,
        }}
        provider={PROVIDER_GOOGLE}
        onPanDrag={handlePanDrag}
        onRegionChangeComplete={handleRegionChangeComplete}
        onLongPress={({nativeEvent}) =>
          setSelectLocation(nativeEvent.coordinate)
        }>
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
      <Animated.View
        style={[
          styles.buttonList,
          {transform: [{translateX: fabTranslateX}], opacity: fabAnim},
        ]}>
        <MapIconButton
          name="magnifying-glass"
          onPress={() => navigation.navigate('SearchLocation')}
        />
        <MapIconButton name="filter" onPress={filterAction.show} />
        <MapIconButton name="plus" variant="primary" onPress={handlePressAddPost} />
        <MapIconButton
          name="location-crosshairs"
          onPress={handlePressUserLocation}
        />
      </Animated.View>

      <View style={styles.bannerContainer}>
        <BannerAdView />
      </View>

      <MarkerModal
        isVisible={markerModal.isVisible}
        markerId={Number(markerId)}
        hide={markerModal.hide}
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
    drawerButton: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      paddingVertical: 10,
      paddingHorizontal: 3,
      backgroundColor: colors[theme].TEAL,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
    },
    buttonList: {
      position: 'absolute',
      bottom: 80,
      right: 20,
      zIndex: 1,
    },
    bannerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
  });

export default MapHomeScreen;

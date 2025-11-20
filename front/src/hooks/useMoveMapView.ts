import {useEffect, useRef, useState} from 'react';
import MapView, {LatLng, Region} from 'react-native-maps';

import {numbers} from '@/constants/numbers';
import useLocationStore from '@/store/location';

type Delta = Pick<Region, 'latitudeDelta' | 'longitudeDelta'>;

function useMoveMapView() {
  const mapRef = useRef<MapView | null>(null);
  const [regionDelta, setRegionDelta] = useState<Delta>(numbers.INITIAL_DELTA);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const {moveLocation} = useLocationStore();

  const moveMapView = (coordinate: LatLng, delta?: Delta) => {
    const newRegion = {
      ...coordinate,
      ...(delta ?? regionDelta),
    };
    mapRef.current?.animateToRegion(newRegion);
    setCurrentRegion(newRegion);
  };

  // 핀 클릭 시 살짝 위로 이동하도록 오프셋 적용
  const moveMapViewWithOffset = (coordinate: LatLng, delta?: Delta) => {
    const latitudeOffset = regionDelta.latitudeDelta * -0.15;
    const adjustedCoordinate = {
      latitude: coordinate.latitude + latitudeOffset,
      longitude: coordinate.longitude,
    };
    const newRegion = {
      ...adjustedCoordinate,
      ...(delta ?? regionDelta),
    };

    mapRef.current?.animateToRegion(newRegion);
    setCurrentRegion(newRegion);
  };

  const handleChangeDelta = (region: Region) => {
    const {latitudeDelta, longitudeDelta} = region;
    setRegionDelta({latitudeDelta, longitudeDelta});
    setCurrentRegion(region);
  };

  useEffect(() => {
    if (moveLocation) {
      const newRegion = {
        ...moveLocation,
        ...regionDelta,
      };
      moveMapView(moveLocation);
      setCurrentRegion(newRegion);
    }
  }, [moveLocation]);

  return {
    mapRef,
    moveMapView,
    moveMapViewWithOffset,
    handleChangeDelta,
    currentRegion,
  };
}

export default useMoveMapView;

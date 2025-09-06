import {useEffect, useState} from 'react';
import {LatLng} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import useAppState from './useAppState';

function useUserLocation() {
  const [userLocation, setUserLocation] = useState<LatLng>({
    latitude: 37.545471,
    longitude: 127.053515,
  });
  const [isUserLocationError, setIsUserLocationError] = useState(false);
  const {isComeback} = useAppState();

  useEffect(() => {
    if (!isComeback) return;

    Geolocation.getCurrentPosition(
      info => {
        setUserLocation(info.coords);
        setIsUserLocationError(false);
      },
      () => {
        setIsUserLocationError(true);
      },
      {
        enableHighAccuracy: true,
      },
    );
  }, [isComeback]);

  return {userLocation, isUserLocationError};
}

export default useUserLocation;

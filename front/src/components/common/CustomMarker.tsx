import React from 'react';
import {View} from 'react-native';
import {LatLng, Marker, MyMapMarkerProps} from 'react-native-maps';

import {MarkerCategory} from '@/constants/markerIcons';
import FoodMarker from './FoodMarker';

interface CustomMarkerProps extends MyMapMarkerProps {
  coordinate?: LatLng;
  color: string;
  score?: number;
}

function CustomMarker({
  coordinate,
  color,
  score = 3,
  ...props
}: CustomMarkerProps) {
  const category = (color || 'ramen') as MarkerCategory;

  const markerView = (
    <View style={{width: 38, height: 38}}>
      <FoodMarker category={category} score={score} size={38} />
    </View>
  );

  return coordinate ? (
    <Marker coordinate={coordinate} {...props}>
      {markerView}
    </Marker>
  ) : (
    markerView
  );
}

export default CustomMarker;

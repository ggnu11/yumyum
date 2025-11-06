import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Marker} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

import {colorSystem} from '@/constants/colors';
import CustomText from '../common/CustomText';

interface CustomClusterMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  pointCount: number;
  onPress?: () => void;
  tracksViewChanges?: boolean;
}

// 클러스터 크기 결정 (포인트 수에 따라)
const getClusterSize = (pointCount: number): number => {
  if (pointCount < 10) {
    return 64; // Small
  } else if (pointCount < 50) {
    return 72; // Medium
  } else {
    return 80; // Large
  }
};

function CustomClusterMarker({
  coordinate,
  pointCount,
  onPress,
  tracksViewChanges = false,
}: CustomClusterMarkerProps) {
  const size = getClusterSize(pointCount);

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      tracksViewChanges={tracksViewChanges}
      identifier={`cluster-${coordinate.latitude}-${coordinate.longitude}-${pointCount}`}>
      <View style={[styles.container, {width: size, height: size}]}>
        <LinearGradient
          colors={colorSystem.primary.gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.gradient, {width: size, height: size, borderRadius: size / 2}]}>
          <CustomText style={[styles.text, {fontSize: size * 0.3}]}>
            {pointCount}
          </CustomText>
        </LinearGradient>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default CustomClusterMarker;


import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {LatLng, Marker, MyMapMarkerProps} from 'react-native-maps';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import {getPinImageFromParams, PinTypeParams} from '@/utils/pinImage';

interface CustomMarkerProps extends MyMapMarkerProps {
  coordinate?: LatLng;
  color: string;
  score?: number;
  pinInfo?: PinTypeParams; // 핀 정보 (있으면 핀 이미지 사용)
  usePinImage?: boolean; // 핀 이미지 사용 여부 (기본값: false, 기존 스타일 유지)
}

function CustomMarker({
  coordinate,
  color,
  score = 5,
  pinInfo,
  usePinImage = false,
  ...props
}: CustomMarkerProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  // 핀 이미지 사용 여부 결정
  const shouldUsePinImage = usePinImage && pinInfo;
  const pinImage = shouldUsePinImage
    ? getPinImageFromParams(pinInfo, 'mini')
    : null;

  const markerView =
    shouldUsePinImage && pinImage ? (
      <View style={styles.pinImageContainer}>
        <Image source={pinImage} style={styles.pinImage} resizeMode="contain" />
      </View>
    ) : (
      <View style={styles.container}>
        <View style={[styles.marker, {backgroundColor: color}]}>
          <View style={[styles.eye, styles.leftEye]} />
          <View style={[styles.eye, styles.rightEye]} />
          {score > 3 && <View style={[styles.mouth, styles.good]} />}
          {score === 3 && <View style={styles.soso} />}
          {score < 3 && <View style={[styles.mouth, styles.bad]} />}
        </View>
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

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: 35,
      width: 32,
      alignItems: 'center',
    },
    pinImageContainer: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pinImage: {
      width: 40,
      height: 40,
    },
    marker: {
      transform: [{rotate: '45deg'}],
      width: 27,
      height: 27,
      borderRadius: 27,
      borderColor: colors[theme][100],
      borderBottomRightRadius: 1,
      borderWidth: 1,
    },
    eye: {
      position: 'absolute',
      backgroundColor: colors[theme][100],
      width: 4,
      height: 4,
      borderRadius: 4,
    },
    leftEye: {
      top: 12,
      left: 5,
    },
    rightEye: {
      top: 5,
      left: 12,
    },
    mouth: {
      transform: [{rotate: '45deg'}],
      width: 12,
      height: 12,
      borderWidth: 1,
      borderRadius: 12,
      borderTopColor: 'rgba(255,255,255 / 0.01)',
      borderBottomColor: 'rgba(255,255,255 / 0.01)',
    },
    good: {
      marginLeft: 5,
      marginTop: 5,
      borderLeftColor: 'rgba(255,255,255 / 0.01)',
    },
    bad: {
      marginLeft: 12,
      marginTop: 12,
      borderRightColor: 'rgba(255,255,255 / 0.01)',
    },
    soso: {
      width: 8,
      height: 8,
      borderLeftColor: colors[theme][100],
      borderLeftWidth: 1,
      marginLeft: 13,
      marginTop: 13,
      transform: [{rotate: '45deg'}],
    },
  });

export default CustomMarker;

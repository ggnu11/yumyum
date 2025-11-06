import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from '../common/CustomText';
import {RegionInfo} from '@/hooks/useSearchLocation';

// 거리 포맷팅 함수 (m 단위 1~999, km 단위 1~999, 소수점 한자리)
const formatDistance = (distance: string): string => {
  const distanceNum = parseInt(distance, 10);
  if (distanceNum < 1000) {
    return `${distanceNum}m`;
  }
  const km = distanceNum / 1000;
  if (km < 1000) {
    return `${km.toFixed(1)}km`;
  }
  return '999+km';
};

interface SearchResultItemProps {
  type: 'recent' | 'place';
  keyword?: string;
  placeInfo?: RegionInfo & {distance?: string; pinCount?: number};
  onPress: () => void;
}

function SearchResultItem({
  type,
  keyword,
  placeInfo,
  onPress,
}: SearchResultItemProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  if (type === 'recent' && keyword) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.iconContainer}>
          <FontAwesome6
            name="magnifying-glass"
            size={18}
            color={colors[theme].GRAY_500}
          />
        </View>
        <CustomText style={styles.keyword}>{keyword}</CustomText>
      </TouchableOpacity>
    );
  }

  if (type === 'place' && placeInfo) {
    const pinColor = placeInfo.category_group_code
      ? colors[theme].PINK_500
      : colors[theme].GRAY_500;

    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={[styles.pinIcon, {backgroundColor: pinColor}]}>
          <FontAwesome6
            name="location-dot"
            size={14}
            color={colors[theme].WHITE}
          />
        </View>
        <View style={styles.placeInfo}>
          <View style={styles.placeHeader}>
            <CustomText style={styles.placeName}>
              {placeInfo.place_name}
            </CustomText>
            {placeInfo.distance && (
              <CustomText style={styles.distance}>
                {formatDistance(placeInfo.distance)}
              </CustomText>
            )}
          </View>
          <View style={styles.addressContainer}>
            <CustomText style={styles.category}>
              {placeInfo.category_name?.split('>').pop()?.trim() || '기타'}
            </CustomText>
            <CustomText style={styles.separator}>·</CustomText>
            <CustomText style={styles.address} numberOfLines={1}>
              {placeInfo.address_name}
            </CustomText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return null;
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors[theme].GRAY_200,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors[theme].GRAY_100,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    pinIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    keyword: {
      fontSize: 15,
      color: colors[theme].BLACK,
      flex: 1,
    },
    placeInfo: {
      flex: 1,
    },
    placeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    placeName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors[theme].BLACK,
      flex: 1,
      marginRight: 8,
    },
    distance: {
      fontSize: 13,
      color: colors[theme].GRAY_500,
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    category: {
      fontSize: 13,
      color: colors[theme].GRAY_700,
    },
    separator: {
      fontSize: 13,
      color: colors[theme].GRAY_500,
      marginHorizontal: 4,
    },
    address: {
      fontSize: 13,
      color: colors[theme].GRAY_500,
      flex: 1,
    },
  });

export default SearchResultItem;

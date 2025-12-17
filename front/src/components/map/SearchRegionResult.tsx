import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {colors} from '@/constants/colors';
import {RegionInfo} from '@/hooks/useSearchLocation';
import useLocationStore from '@/store/location';
import useThemeStore, {Theme} from '@/store/theme';
import {useNavigation} from '@react-navigation/native';
import {LatLng} from 'react-native-maps';
import CustomText from '../common/CustomText';

interface SearchRegionResultProps {
  regionInfo: RegionInfo[];
}

function SearchRegionResult({regionInfo}: SearchRegionResultProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation();
  const {setMoveLocation, setSelectedPlaceFromSearch} = useLocationStore();

  const handlePressRegionInfo = (regionInfo: RegionInfo) => {
    const regionLocation = {
      latitude: Number(regionInfo.y),
      longitude: Number(regionInfo.x),
    };

    // 선택된 장소 정보를 저장
    setSelectedPlaceFromSearch(regionInfo);
    moveToMapScreen(regionLocation);
  };

  const moveToMapScreen = (location: LatLng) => {
    navigation.goBack();

    setMoveLocation(location);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {regionInfo.map((info, index) => (
          <Pressable
            key={info.id}
            style={[
              styles.itemBorder,
              index === regionInfo.length - 1 && styles.noItemBorder,
            ]}
            onPress={() => handlePressRegionInfo(info)}>
            <View style={styles.placeNameContainer}>
              <Ionicons
                name="location"
                size={10}
                color={colors[theme].PINK_700}
              />
              <CustomText
                style={styles.placeText}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {info.place_name}
              </CustomText>
            </View>
            <View style={styles.categoryContainer}>
              <CustomText style={styles.distanceText}>
                {(Number(info.distance) / 1000).toFixed(2)}km
              </CustomText>
              <CustomText style={styles.subInfoText}>
                {info.category_name}
              </CustomText>
            </View>
            <CustomText style={styles.subInfoText}>
              {info.road_address_name}
            </CustomText>
          </Pressable>
        ))}

        {regionInfo.length === 0 && (
          <View style={styles.noResultContainer}>
            <CustomText style={styles.noResultText}>
              검색 결과가 없습니다.
            </CustomText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors[theme].GRAY_200,
      borderRadius: 5,
      height: Dimensions.get('screen').height / 2,
      marginVertical: 5,
      width: '100%',
    },
    scrollContainer: {
      padding: 10,
    },
    itemBorder: {
      marginHorizontal: 5,
      paddingVertical: 10,
      borderBottomColor: colors[theme].GRAY_300,
      borderBottomWidth: StyleSheet.hairlineWidth,
      gap: 3,
    },
    placeNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    placeText: {
      color: colors[theme][100],
      flexShrink: 1,
      fontSize: 16,
      fontWeight: '600',
    },
    categoryContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    distanceText: {
      color: colors[theme][100],
    },
    subInfoText: {
      color: colors[theme].GRAY_500,
      flexShrink: 1,
    },
    noResultContainer: {
      flex: 1,
      alignItems: 'center',
      marginTop: 50,
    },
    noResultText: {
      color: colors[theme].GRAY_500,
      fontSize: 16,
    },
    noItemBorder: {
      borderBottomWidth: 0,
    },
  });

export default SearchRegionResult;

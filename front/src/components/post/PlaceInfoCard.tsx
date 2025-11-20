import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from '../common/CustomText';
import {PlaceInfo} from '@/types/api';

interface PlaceInfoCardProps {
  placeInfo: PlaceInfo;
}

function PlaceInfoCard({placeInfo}: PlaceInfoCardProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome6
          name="utensils"
          size={20}
          color={colors[theme].GRAY_500}
          iconStyle="solid"
        />
      </View>
      <View style={styles.infoContainer}>
        <CustomText style={styles.placeName} numberOfLines={1}>
          {placeInfo.place_name}
        </CustomText>
        <View style={styles.addressRow}>
          <Image
            source={require('@/assets/common/pin.png')}
            style={styles.pinIcon}
            resizeMode="contain"
          />
          <CustomText style={styles.address} numberOfLines={1}>
            {placeInfo.address}
          </CustomText>
        </View>
      </View>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors[theme].GRAY_200,
      borderRadius: 8,
      padding: 16,
      backgroundColor: colors[theme].GRAY_100,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors[theme].GRAY_200,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    infoContainer: {
      flex: 1,
    },
    placeName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors[theme][100],
      marginBottom: 4,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pinIcon: {
      width: 14,
      height: 14,
      marginRight: 4,
      tintColor: colors[theme].GRAY_500,
    },
    address: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
      flex: 1,
    },
  });

export default PlaceInfoCard;


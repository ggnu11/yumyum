import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import {PlaceInfo} from '../../types/api';
import CusmtomText from '../common/CustomText';

interface PlaceSummaryViewProps {
  placeInfo: PlaceInfo | null;
  isBookmarked?: boolean;
  onBookmarkPress?: () => void;
}

function PlaceSummaryView({
  placeInfo,
  isBookmarked = false,
  onBookmarkPress,
}: PlaceSummaryViewProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  if (!placeInfo) {
    return null;
  }

  return (
    <View style={styles.summarySection}>
      {/* 장소 이름과 즐겨찾기 */}
      <View style={styles.placeHeader}>
        <CusmtomText style={styles.placeName}>
          {placeInfo.place_name}
        </CusmtomText>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={onBookmarkPress}>
          <FontAwesome6
            name="bookmark"
            size={20}
            color={
              isBookmarked ? colors[theme].PINK_700 : colors[theme].GRAY_500
            }
            iconStyle={isBookmarked ? 'solid' : 'regular'}
          />
        </TouchableOpacity>
      </View>

      {/* 총 핀 개수 */}
      <CusmtomText style={styles.pinCount}>
        총 {placeInfo.total_pin_count}개의 기록
      </CusmtomText>

      {/* 장소 기본 정보 */}
      <View style={styles.placeInfoSection}>
        {placeInfo.address && (
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={colors[theme].GRAY_500}
            />
            <CusmtomText style={styles.infoText}>
              {placeInfo.address}
            </CusmtomText>
          </View>
        )}

        {placeInfo.phone_number && (
          <View style={styles.infoRow}>
            <Ionicons
              name="call-outline"
              size={16}
              color={colors[theme].GRAY_500}
            />
            <CusmtomText style={styles.infoText}>
              {placeInfo.phone_number}
            </CusmtomText>
          </View>
        )}

        {placeInfo.operating_hours && (
          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors[theme].GRAY_500}
            />
            <CusmtomText style={styles.infoText}>
              {placeInfo.operating_hours}
            </CusmtomText>
          </View>
        )}
      </View>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    summarySection: {
      paddingTop: 8,
    },
    placeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    placeName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors[theme].BLACK,
      flex: 1,
    },
    bookmarkButton: {
      padding: 8,
    },
    pinCount: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
      marginBottom: 16,
    },
    placeInfoSection: {
      gap: 8,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors[theme].GRAY_700,
      flex: 1,
    },
  });

export default PlaceSummaryView;

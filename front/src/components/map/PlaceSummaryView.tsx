import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import {PlaceInfo} from '../../types/api';
import CusmtomText from '../common/CustomText';

interface PlaceSummaryViewProps {
  placeInfo: PlaceInfo | null;
  recordImages?: string[]; // 해당 장소의 기록 이미지들
  isBookmarked?: boolean;
  onBookmarkPress?: () => void;
}

function PlaceSummaryView({
  placeInfo,
  recordImages = [],
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

      {/* 기록카드 갯수 */}
      <View style={styles.recordCountRow}>
        <Ionicons
          name="reader-outline"
          size={16}
          color={colors[theme].GRAY_500}
        />
        <CusmtomText style={styles.recordCount}>
          기록카드 {placeInfo.total_pin_count}개
        </CusmtomText>
      </View>

      {/* 장소 기본 정보 */}
      <View style={styles.placeInfoSection}>
        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors[theme].GRAY_500}
          />
          <CusmtomText style={styles.infoText}>
            {placeInfo.address || '주소 정보 없음'}
          </CusmtomText>
        </View>

        {placeInfo.phone_number && (
          <View style={styles.infoRow}>
            <Ionicons
              name="call-outline"
              size={16}
              color={colors[theme].BLUE_100}
            />
            <CusmtomText style={[styles.infoText, styles.phoneText]}>
              {placeInfo.phone_number}
            </CusmtomText>
          </View>
        )}
      </View>

      {/* 기록 이미지들 - 가로 스크롤 */}
      {recordImages.length > 0 && (
        <View style={styles.recordImagesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesScrollContent}>
            {recordImages.slice(0, 6).map((imageUri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{uri: imageUri}} style={styles.recordImage} />
                {index === 5 && recordImages.length > 6 && (
                  <View style={styles.moreImagesOverlay}>
                    <CusmtomText style={styles.moreImagesText}>
                      +{recordImages.length - 5}
                    </CusmtomText>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
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
    recordCountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 16,
    },
    recordCount: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
    },
    placeInfoSection: {
      gap: 8,
      marginBottom: 16,
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
    phoneText: {
      color: colors[theme].BLUE_100,
    },
    recordImagesSection: {
      marginTop: 8,
    },
    imagesScrollContent: {
      paddingRight: 20,
    },
    imageContainer: {
      position: 'relative',
      marginRight: 8,
    },
    recordImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: colors[theme].GRAY_200,
    },
    moreImagesOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    moreImagesText: {
      color: colors[theme].WHITE,
      fontSize: 12,
      fontWeight: 'bold',
    },
  });

export default PlaceSummaryView;

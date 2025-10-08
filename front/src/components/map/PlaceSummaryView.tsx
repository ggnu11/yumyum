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
  Clipboard,
  Alert,
} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import {PlaceInfo} from '../../types/api';
import CustomText from '../common/CustomText';

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
      {/* 장소 이름과 위시(즐겨찾기) */}
      <View style={styles.placeHeader}>
        <CustomText style={styles.placeName}>{placeInfo.place_name}</CustomText>
        <TouchableOpacity style={styles.wishButton} onPress={onBookmarkPress}>
          <Ionicons
            name={isBookmarked ? 'star' : 'star-outline'}
            size={24}
            color={
              isBookmarked ? colors[theme].YELLOW_500 : colors[theme].GRAY_500
            }
          />
        </TouchableOpacity>
      </View>

      {/* 장소 카테고리 */}
      <View style={styles.categorySection}>
        <CustomText style={styles.categoryText}>칼국수, 만두</CustomText>
      </View>

      {/* 기록카드 갯수 */}
      <View style={styles.recordCountRow}>
        <Ionicons
          name="reader-outline"
          size={16}
          color={colors[theme].GRAY_500}
        />
        <CustomText style={styles.recordCount}>
          기록카드 {placeInfo.total_pin_count}개
        </CustomText>
      </View>

      {/* 장소 기본 정보 */}
      <View style={styles.placeInfoSection}>
        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors[theme].GRAY_500}
          />
          <CustomText style={styles.infoText}>
            {placeInfo.address || '주소 정보 없음'}
          </CustomText>
        </View>

        {placeInfo.phone_number && (
          <TouchableOpacity
            style={styles.phoneRow}
            onPress={() => {
              Clipboard.setString(placeInfo.phone_number);
              Alert.alert('복사됨', '전화번호가 클립보드에 복사되었습니다.');
            }}>
            <Ionicons
              name="call-outline"
              size={16}
              color={colors[theme].BLUE_100}
            />
            <CustomText style={[styles.infoText, styles.phoneText]}>
              {placeInfo.phone_number}
            </CustomText>
            <CustomText style={styles.copyText}>복사</CustomText>
          </TouchableOpacity>
        )}
      </View>

      {/* Google Places에서 가져온 장소 이미지들 */}
      {placeInfo.place_images && placeInfo.place_images.length > 0 && (
        <View style={styles.placeImagesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesScrollContent}>
            {placeInfo.place_images.slice(0, 6).map((imageUri, index) => {
              const isLastItem = index === 5;
              const hasMoreImages = placeInfo.place_images!.length > 6;
              const showMoreButton = isLastItem && hasMoreImages;

              return (
                <View key={`place-${index}`} style={styles.imageContainer}>
                  <Image source={{uri: imageUri}} style={styles.placeImage} />
                  {showMoreButton && (
                    <TouchableOpacity
                      style={styles.moreImagesOverlay}
                      onPress={() => {
                        // TODO: 더보기 기능 구현
                        console.log('더보기 클릭');
                      }}>
                      <CustomText style={styles.moreImagesText}>
                        +{placeInfo.place_images!.length - 5}
                      </CustomText>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
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
    wishButton: {
      padding: 8,
    },
    categorySection: {
      marginBottom: 12,
    },
    categoryText: {
      fontSize: 14,
      color: colors[theme].GRAY_700,
      fontWeight: '500',
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
    phoneRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 4,
    },
    infoText: {
      fontSize: 14,
      color: colors[theme].GRAY_700,
      flex: 1,
    },
    phoneText: {
      color: colors[theme].BLUE_100,
    },
    copyText: {
      fontSize: 12,
      color: colors[theme].BLUE_100,
      fontWeight: '600',
      marginLeft: 4,
    },
    placeImagesSection: {
      marginBottom: 12,
    },
    imagesScrollContent: {
      paddingRight: 20,
    },
    imageContainer: {
      position: 'relative',
      marginRight: 8,
    },
    placeImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: colors[theme].GRAY_200,
    },
    moreImagesOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 12,
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

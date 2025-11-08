import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Ionicons from '@react-native-vector-icons/ionicons';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Clipboard,
  Alert,
  Animated,
  Modal,
} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import {PlaceInfo} from '../../types/api';
import CustomText from '../common/CustomText';
import PhotoListView from './PhotoListView';
import PhotoExpandView from './PhotoExpandView';
import {formatPlaceTypes} from '../../utils/placeUtils';
import {getPinImageFromParams, PinTypeParams} from '../../utils/pinImage';

interface PlaceSummaryViewProps {
  placeInfo: PlaceInfo | null;
  isBookmarked?: boolean;
  onBookmarkPress?: () => void;
  isExpanded?: boolean;
  pinInfo?: PinTypeParams; // 핀 정보 (있으면 large 핀 이미지 표시)
}

function PlaceSummaryView({
  placeInfo,
  isBookmarked = false,
  onBookmarkPress,
  isExpanded = false,
  pinInfo,
}: PlaceSummaryViewProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const imageSize = useRef(new Animated.Value(100)).current;
  const [showPhotoList, setShowPhotoList] = useState(false);
  const [showPhotoExpand, setShowPhotoExpand] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    Animated.timing(imageSize, {
      toValue: isExpanded ? 50 : 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, imageSize]);

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setShowPhotoExpand(true);
  };

  const handleMorePress = () => {
    setShowPhotoList(true);
  };

  if (!placeInfo) {
    return null;
  }

  return (
    <View style={styles.summarySection}>
      {/* 장소 이름, 카테고리, 위시(즐겨찾기) */}
      <View style={styles.placeHeader}>
        <View style={styles.placeNameRow}>
          <CustomText style={styles.placeName}>
            {placeInfo.place_name}
          </CustomText>
          {placeInfo.types && formatPlaceTypes(placeInfo.types) && (
            <CustomText style={styles.categoryText}>
              {formatPlaceTypes(placeInfo.types)}
            </CustomText>
          )}
        </View>
        {!isExpanded && (
          <TouchableOpacity style={styles.wishButton} onPress={onBookmarkPress}>
            <Ionicons
              name={isBookmarked ? 'star' : 'star-outline'}
              size={24}
              color={
                isBookmarked ? colors[theme].YELLOW_500 : colors[theme].GRAY_500
              }
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 기록카드 갯수 및 핀 이미지 */}
      <View style={styles.recordCountRow}>
        {pinInfo && (
          <Image
            source={getPinImageFromParams(pinInfo, 'large')}
            style={styles.pinImage}
            resizeMode="contain"
          />
        )}
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
          <View style={styles.phoneRow}>
            <View style={styles.phoneNumberRow}>
              <Ionicons
                name="call-outline"
                size={16}
                color={colors[theme].GRAY_500}
              />
              <CustomText style={styles.infoText}>
                {placeInfo.phone_number}
              </CustomText>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => {
                Clipboard.setString(placeInfo.phone_number);
                Alert.alert('복사됨', '전화번호가 클립보드에 복사되었습니다.');
              }}>
              <CustomText style={styles.copyText}>복사</CustomText>
            </TouchableOpacity>
          </View>
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
                  <TouchableOpacity onPress={() => handleImagePress(index)}>
                    <Animated.Image
                      source={{uri: imageUri}}
                      style={[
                        styles.placeImage,
                        {
                          width: imageSize,
                          height: imageSize,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                  {showMoreButton && (
                    <TouchableOpacity
                      style={styles.moreImagesOverlay}
                      onPress={handleMorePress}>
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

      {/* 사진 목록 모달 */}
      <Modal
        visible={showPhotoList}
        animationType="slide"
        presentationStyle="fullScreen">
        <PhotoListView
          images={placeInfo.place_images || []}
          placeName={placeInfo.place_name}
          category={formatPlaceTypes(placeInfo.types)}
          onClose={() => setShowPhotoList(false)}
        />
      </Modal>

      {/* 사진 확대 모달 */}
      <Modal
        visible={showPhotoExpand}
        animationType="fade"
        presentationStyle="fullScreen">
        <PhotoExpandView
          images={placeInfo.place_images || []}
          initialIndex={selectedImageIndex}
          onClose={() => setShowPhotoExpand(false)}
        />
      </Modal>
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
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    placeNameRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
      flex: 1,
    },
    placeName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors[theme][100],
    },
    categoryText: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
      fontWeight: '400',
    },
    wishButton: {
      padding: 8,
    },
    recordCountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 16,
    },
    pinImage: {
      width: 24,
      height: 24,
      marginRight: 4,
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
    },
    phoneNumberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors[theme].GRAY_700,
    },
    copyButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    copyText: {
      fontSize: 12,
      color: colors[theme].BLUE_500,
      fontWeight: '600',
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
      color: colors[theme][0],
      fontSize: 12,
      fontWeight: 'bold',
    },
  });

export default PlaceSummaryView;

import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from '../common/CustomText';
import PhotoListView from './PhotoListView';
import PhotoExpandView from './PhotoExpandView';

interface RecordImageViewProps {
  images: string[];
  isExpanded?: boolean;
}

function RecordImageView({images, isExpanded = false}: RecordImageViewProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const imageSize = useRef(new Animated.Value(100)).current;
  const [showPhotoList, setShowPhotoList] = useState(false);
  const [showPhotoExpand, setShowPhotoExpand] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    // 확장 상태에서는 이미지 크기를 더 크게 표시
    Animated.timing(imageSize, {
      toValue: isExpanded ? 100 : 100,
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

  if (!images || images.length === 0) {
    return null;
  }

  const MAX_VISIBLE_IMAGES = 3;
  const hasMoreImages = images.length > MAX_VISIBLE_IMAGES;
  const visibleImages = images.slice(0, MAX_VISIBLE_IMAGES);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.imageContainer}>
        {visibleImages.map((uri, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(index)}
            style={styles.imageWrapper}>
            <Animated.Image
              source={{uri}}
              style={[
                styles.recordImage,
                {
                  width: imageSize,
                  height: imageSize,
                },
              ]}
            />
            {/* 마지막 이미지에 더보기 오버레이 표시 */}
            {hasMoreImages && index === MAX_VISIBLE_IMAGES - 1 && (
              <TouchableOpacity
                style={styles.moreOverlay}
                onPress={handleMorePress}>
                <CustomText style={styles.moreText}>
                  +{images.length - MAX_VISIBLE_IMAGES}
                </CustomText>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 사진 목록 모달 */}
      <Modal
        visible={showPhotoList}
        animationType="slide"
        presentationStyle="fullScreen">
        <PhotoListView
          images={images}
          placeName="기록 이미지"
          category={`사진 ${images.length}장`}
          onClose={() => setShowPhotoList(false)}
        />
      </Modal>

      {/* 사진 확대 모달 */}
      <Modal
        visible={showPhotoExpand}
        animationType="fade"
        presentationStyle="fullScreen">
        <PhotoExpandView
          images={images}
          initialIndex={selectedImageIndex}
          onClose={() => setShowPhotoExpand(false)}
        />
      </Modal>
    </>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    scrollContainer: {
      marginTop: 4,
    },
    imageContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    imageWrapper: {
      position: 'relative',
    },
    recordImage: {
      borderRadius: 8,
      backgroundColor: colors[theme].GRAY_200,
    },
    moreOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    moreText: {
      color: colors[theme][0],
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default RecordImageView;

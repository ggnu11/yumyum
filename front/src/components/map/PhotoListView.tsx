import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from '../common/CustomText';
import PhotoExpandView from './PhotoExpandView';

interface PhotoListViewProps {
  images: string[];
  placeName?: string;
  category?: string;
  onImagePress?: (index: number) => void; // 선택적으로 변경
  onClose: () => void;
}

const {width: screenWidth} = Dimensions.get('window');
const imageSize = (screenWidth - 60) / 3; // 여백 20*2 + 간격 10*2 = 60

function PhotoListView({
  images,
  placeName,
  category,
  onImagePress,
  onClose,
}: PhotoListViewProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const [showPhotoExpand, setShowPhotoExpand] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImagePress = (index: number) => {
    if (onImagePress) {
      // 기존 방식 (부모에서 처리)
      onImagePress(index);
    } else {
      // 직접 확대 뷰 표시
      setSelectedImageIndex(index);
      setShowPhotoExpand(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상태바 영역 */}
      <View style={styles.statusBar} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors[theme].BLACK} />
        </TouchableOpacity>
        <View style={styles.placeInfo}>
          <View style={styles.placeNameRow}>
            <CustomText style={styles.placeName} numberOfLines={1}>
              {placeName || '장소명'}
            </CustomText>
            <CustomText style={styles.category} numberOfLines={1}>
              {category || '카테고리'}
            </CustomText>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {images.map((uri, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageContainer}
              onPress={() => handleImagePress(index)}>
              <Image source={{uri}} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme].WHITE,
    },
    statusBar: {
      height: 44,
      backgroundColor: colors[theme].WHITE,
    },
    header: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: colors[theme].WHITE,
      borderBottomWidth: 1,
      borderBottomColor: colors[theme].GRAY_200,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    placeInfo: {
      flex: 1,
    },
    placeNameRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
    },
    placeName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors[theme].BLACK,
      flexShrink: 1,
    },
    category: {
      fontSize: 14,
      color: colors[theme].GRAY_500,
      flexShrink: 0,
    },
    scrollView: {
      flex: 1,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 20,
      gap: 10,
    },
    imageContainer: {
      width: imageSize,
      height: imageSize,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      backgroundColor: colors[theme].GRAY_200,
    },
  });

export default PhotoListView;

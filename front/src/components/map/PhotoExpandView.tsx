import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from '../common/CustomText';

interface PhotoExpandViewProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const {width: screenWidth} = Dimensions.get('window');

function PhotoExpandView({
  images,
  initialIndex,
  onClose,
}: PhotoExpandViewProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // 초기 인덱스로 스크롤
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: initialIndex * screenWidth,
        animated: false,
      });
    }, 100);
  }, [initialIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <CustomText style={styles.counter}>
          {currentIndex + 1} / {images.length}
        </CustomText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <CustomText style={styles.closeText}>✕</CustomText>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{uri}} style={styles.image} resizeMode="contain" />
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme][100],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingTop: 60, // 상태바 영역
    },
    closeButton: {
      padding: 8,
    },
    closeText: {
      fontSize: 18,
      color: colors[theme][0],
    },
    counter: {
      fontSize: 16,
      color: colors[theme][0],
    },
    placeholder: {
      width: 34,
    },
    scrollView: {
      flex: 1,
    },
    imageWrapper: {
      width: screenWidth,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    image: {
      width: screenWidth * 0.9,
      height: '80%',
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    activeDot: {
      backgroundColor: colors[theme][0],
    },
    inactiveDot: {
      backgroundColor: colors[theme].GRAY_500,
    },
  });

export default PhotoExpandView;

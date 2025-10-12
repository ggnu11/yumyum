import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Animated, ScrollView} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';

interface RecordImageViewProps {
  images: string[];
  isExpanded?: boolean;
}

function RecordImageView({images, isExpanded = false}: RecordImageViewProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const imageSize = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(imageSize, {
      toValue: isExpanded ? 50 : 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, imageSize]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={styles.imageContainer}>
      {images.map((uri, index) => (
        <Animated.Image
          key={index}
          source={{uri}}
          style={[
            styles.recordImage,
            {
              width: imageSize,
              height: imageSize,
            },
          ]}
        />
      ))}
    </ScrollView>
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
    recordImage: {
      borderRadius: 8,
      backgroundColor: colors[theme].GRAY_200,
    },
  });

export default RecordImageView;

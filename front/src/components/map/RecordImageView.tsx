import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CusmtomText from '../common/CustomText';

interface RecordImageViewProps {
  images: string[];
}

function RecordImageView({images}: RecordImageViewProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <View style={styles.imageContainer}>
      <Image source={{uri: images[0]}} style={styles.recordImage} />
      {images.length > 1 && (
        <View style={styles.imageCountBadge}>
          <CusmtomText style={styles.imageCountText}>
            +{images.length - 1}
          </CusmtomText>
        </View>
      )}
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    imageContainer: {
      position: 'relative',
      marginHorizontal: 16,
      marginBottom: 8,
    },
    recordImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
    },
    imageCountBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    imageCountText: {
      color: colors[theme].UNCHANGE_WHITE,
      fontSize: 12,
      fontWeight: '500',
    },
  });

export default RecordImageView;

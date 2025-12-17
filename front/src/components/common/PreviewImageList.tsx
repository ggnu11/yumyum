import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {Image, Platform, Pressable, ScrollView, StyleSheet} from 'react-native';

import {BASE_URL} from '@/api/axios';
import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import {ImageUri} from '@/types/domain';
import {FeedStackParamList} from '@/types/navigation';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

interface PreviewImageListProps {
  imageUris: ImageUri[];
  onDelete?: (uri: string) => void;
  showDeleteButton?: boolean;
  onPressImage?: (index: number) => void;
}

function PreviewImageList({
  imageUris,
  onDelete,
  showDeleteButton = false,
  onPressImage,
}: PreviewImageListProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<NavigationProp<FeedStackParamList>>();
  const route = useRoute<RouteProp<FeedStackParamList>>();

  const handlePressImage = (index: number) => {
    if (onPressImage) {
      onPressImage(index);
    } else {
      navigation.navigate('ImageZoom', {
        id: route.params?.id,
        index,
      });
    }
  };

  return (
    <ScrollView horizontal contentContainerStyle={styles.container}>
      {imageUris.map(({uri}, index) => {
        return (
          <Pressable
            key={uri}
            style={styles.imageContainer}
            onPress={() => handlePressImage(index)}>
            <Image style={styles.image} source={{uri}} resizeMode="cover" />
            {showDeleteButton && (
              <Pressable
                style={styles.deleteButton}
                onPress={() => onDelete?.(uri)}>
                <Ionicons name="close" size={16} color={colors[theme][0]} />
              </Pressable>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: 15,
      paddingHorizontal: 15,
    },
    imageContainer: {
      width: 70,
      height: 70,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    deleteButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: colors[theme][100],
    },
  });

export default PreviewImageList;

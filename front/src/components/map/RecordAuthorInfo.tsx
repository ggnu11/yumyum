import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';

interface Author {
  name: string;
  profileImage?: string;
}

interface RecordAuthorInfoProps {
  author: Author;
}

function RecordAuthorInfo({author}: RecordAuthorInfoProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.authorInfo}>
      {author.profileImage ? (
        <Image
          source={{uri: author.profileImage}}
          style={styles.profileImage}
        />
      ) : (
        <View style={styles.defaultProfileImage}>
          <FontAwesome6
            name="user"
            size={12}
            color={colors[theme].GRAY_500}
            iconStyle="solid"
          />
        </View>
      )}
      <Text style={styles.authorName}>{author.name}</Text>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    authorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    profileImage: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    defaultProfileImage: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors[theme].GRAY_200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    authorName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors[theme].GRAY_700,
    },
  });

export default RecordAuthorInfo;

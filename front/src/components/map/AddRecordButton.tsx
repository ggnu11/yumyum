import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';

interface AddRecordButtonProps {
  onPress: () => void;
}

function AddRecordButton({onPress}: AddRecordButtonProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.actionButtonContainer}>
      <TouchableOpacity style={styles.addRecordButton} onPress={onPress}>
        <FontAwesome6
          name="plus"
          size={16}
          color={colors[theme].WHITE}
          iconStyle="solid"
        />
        <Text style={styles.addRecordText}>내 기록 추가하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    actionButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors[theme].WHITE,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors[theme].GRAY_200,
    },
    addRecordButton: {
      backgroundColor: colors[theme].PINK_700,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
    },
    addRecordText: {
      color: colors[theme].WHITE,
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default AddRecordButton;

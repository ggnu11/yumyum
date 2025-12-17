import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from '../common/CustomText';

interface ImageInputProps {
  onChange: () => void;
  disabled?: boolean;
}

function ImageInput({onChange, disabled = false}: ImageInputProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <Pressable
      style={({pressed}) => [
        pressed && !disabled && styles.imageInputPressed,
        styles.imageInput,
        disabled && styles.imageInputDisabled,
      ]}
      onPress={onChange}
      disabled={disabled}>
      <Ionicons
        name="camera-outline"
        size={20}
        color={disabled ? colors[theme].GRAY_300 : colors[theme].GRAY_500}
      />
      <CustomText
        style={[styles.inputText, disabled && styles.inputTextDisabled]}>
        사진 추가
      </CustomText>
    </Pressable>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    imageInput: {
      borderWidth: 1.5,
      borderStyle: 'dotted',
      borderColor: colors[theme].GRAY_300,
      height: 70,
      width: 70,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
    },
    imageInputPressed: {
      opacity: 0.5,
    },
    imageInputDisabled: {
      opacity: 0.4,
      borderColor: colors[theme].GRAY_200,
    },
    inputText: {
      fontSize: 12,
      color: colors[theme].GRAY_500,
    },
    inputTextDisabled: {
      color: colors[theme].GRAY_300,
    },
  });

export default ImageInput;

import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from '../common/CustomText';
import CommonActionSheet from '../common/CommonActionSheet';

interface PrivacyScopePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
}

const PRIVACY_OPTIONS = [
  {id: 'public', label: '모두 공개'},
  {id: 'private', label: '나만 보기'},
  {id: 'friends', label: '친구만'},
];

function PrivacyScopePicker({
  value,
  onChange,
  error,
  touched,
}: PrivacyScopePickerProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = PRIVACY_OPTIONS.find(option => option.id === value);
  const displayText = selectedOption?.label || '공개 범위를 선택해 주세요';

  const actions = PRIVACY_OPTIONS.map(option => ({
    text: option.label,
    onPress: () => {
      onChange(option.id);
      setIsVisible(false);
    },
  }));

  return (
    <View>
      <Pressable
        style={[
          styles.container,
          touched && Boolean(error) && styles.containerError,
        ]}
        onPress={() => setIsVisible(true)}>
        <CustomText
          style={[
            styles.text,
            !selectedOption && styles.placeholder,
          ]}>
          {displayText}
        </CustomText>
        <Ionicons
          name="chevron-down"
          size={20}
          color={colors[theme].GRAY_500}
        />
      </Pressable>
      {touched && Boolean(error) && (
        <CustomText style={styles.error}>{error}</CustomText>
      )}
      <CommonActionSheet
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        actions={actions}
      />
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors[theme].GRAY_200,
      borderRadius: 8,
      height: 50,
      paddingHorizontal: 16,
      backgroundColor: colors[theme].GRAY_100,
    },
    containerError: {
      borderColor: colors[theme].RED_300,
    },
    text: {
      fontSize: 16,
      color: colors[theme][100],
      flex: 1,
    },
    placeholder: {
      color: colors[theme].GRAY_500,
    },
    error: {
      color: colors[theme].RED_500,
      fontSize: 12,
      paddingTop: 5,
    },
  });

export default PrivacyScopePicker;


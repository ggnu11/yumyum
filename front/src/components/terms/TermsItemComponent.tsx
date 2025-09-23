import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import {TermsItemComponentProps} from './types';

function TermsItemComponent({
  item,
  index,
  onItemCheck,
  onDetailPress,
}: TermsItemComponentProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  const renderTermText = () => {
    if (item.id === 'all') {
      return (
        <Text style={[styles.termText, styles.allTermText]}>{item.title}</Text>
      );
    }

    if (item.id === 'terms') {
      return (
        <Text style={styles.termText}>
          <Text
            style={styles.underlineText}
            onPress={() => onDetailPress('terms', '이용약관')}>
            이용약관
          </Text>
          {' 및 '}
          <Text
            style={styles.underlineText}
            onPress={() => onDetailPress('privacy', '개인정보위탁방침')}>
            개인정보위탁방침
          </Text>
          {' (필수)'}
        </Text>
      );
    }

    if (item.id === 'location') {
      return (
        <Text style={styles.termText}>
          <Text
            style={styles.underlineText}
            onPress={() =>
              onDetailPress('location', '위치기반서비스 이용약관')
            }>
            위치기반서비스
          </Text>
          {' 이용약관 (필수)'}
        </Text>
      );
    }

    if (item.id === 'marketing') {
      return (
        <Text style={styles.termText}>
          <Text
            style={styles.underlineText}
            onPress={() => onDetailPress('marketing', '마케팅 정보 수신 동의')}>
            마케팅 정보 수신 동의
          </Text>
          {' (선택)'}
        </Text>
      );
    }

    return <Text style={styles.termText}>{item.title}</Text>;
  };

  return (
    <View style={styles.termItemContainer}>
      {index === 1 && <View style={styles.separator} />}
      <View style={styles.termItem}>
        <View style={styles.termTextContainer}>{renderTermText()}</View>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onItemCheck(item.id)}>
          <View
            style={[styles.checkbox, item.isChecked && styles.checkedCheckbox]}>
            {item.isChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    termItemContainer: {
      marginBottom: 0,
    },
    separator: {
      height: 1,
      backgroundColor: colors[theme].GRAY_200,
      marginVertical: 0,
    },
    termItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 18,
    },
    termTextContainer: {
      flex: 1,
      marginRight: 12,
    },
    checkboxContainer: {
      padding: 4,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors[theme].GRAY_300,
      backgroundColor: colors[theme].WHITE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkedCheckbox: {
      backgroundColor: colors[theme].GRAY_500,
      borderColor: colors[theme].GRAY_500,
    },
    checkmark: {
      color: colors[theme].WHITE,
      fontSize: 14,
      fontWeight: 'bold',
    },
    termText: {
      fontSize: 16,
      color: colors[theme].BLACK,
      fontWeight: '400',
    },
    underlineText: {
      textDecorationLine: 'underline',
    },
    allTermText: {
      fontWeight: '600',
      fontSize: 16,
    },
  });

export default TermsItemComponent;

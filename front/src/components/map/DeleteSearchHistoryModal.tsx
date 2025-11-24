import React from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from '../common/CustomText';

interface DeleteSearchHistoryModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteSearchHistoryModal({
  visible,
  onConfirm,
  onCancel,
}: DeleteSearchHistoryModalProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <CustomText style={styles.title}>
            최근 검색 기록을 삭제할까요?
          </CustomText>
          <CustomText style={styles.description}>
            최근에 검색한 모든 검색어가 삭제돼요.{'\n'}삭제를 진행할까요?
          </CustomText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}>
              <CustomText style={styles.cancelButtonText}>취소하기</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}>
              <CustomText style={styles.confirmButtonText}>삭제하기</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
    },
    modalContainer: {
      backgroundColor: colors[theme][0],
      borderRadius: 20,
      padding: 30,
      width: '100%',
      maxWidth: 400,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors[theme][100],
      textAlign: 'center',
      marginBottom: 12,
    },
    description: {
      fontSize: 14,
      color: colors[theme].GRAY_700,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    button: {
      flex: 1,
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors[theme].GRAY_200,
    },
    confirmButton: {
      backgroundColor: colors[theme][100],
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors[theme].GRAY_700,
    },
    confirmButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors[theme][0],
    },
  });

export default DeleteSearchHistoryModal;




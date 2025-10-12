import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from '../common/CustomText';

interface RecordActionMenuProps {
  recordId: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

function RecordActionMenu({recordId, onEdit, onDelete}: RecordActionMenuProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleMorePress = () => {
    setShowActionSheet(true);
  };

  const handleEdit = () => {
    setShowActionSheet(false);
    onEdit?.(recordId);
  };

  const handleDeletePress = () => {
    setShowActionSheet(false);
    // ActionSheet가 닫힌 후 삭제 확인 모달 표시
    setTimeout(() => {
      setShowDeleteModal(true);
    }, 300);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete?.(recordId);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <TouchableOpacity onPress={handleMorePress} style={styles.moreButton}>
        <FontAwesome6
          name="ellipsis"
          size={16}
          color={colors[theme].GRAY_500}
          iconStyle="solid"
        />
      </TouchableOpacity>

      {/* ActionSheet 모달 */}
      <Modal
        visible={showActionSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionSheet(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowActionSheet(false)}>
          <View style={styles.actionSheetContainer}>
            <View style={styles.actionSheet}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDeletePress}>
                <CustomText style={styles.deleteButtonText}>
                  삭제하기
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={handleEdit}>
                <CustomText style={styles.editButtonText}>수정하기</CustomText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowActionSheet(false)}>
              <CustomText style={styles.cancelButtonText}>취소</CustomText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}>
        <Pressable style={styles.modalOverlay} onPress={handleCancelDelete}>
          <Pressable style={styles.deleteModalContainer}>
            <View style={styles.deleteModal}>
              <CustomText style={styles.deleteModalTitle}>
                기록카드를 삭제할까요?
              </CustomText>
              <CustomText style={styles.deleteModalMessage}>
                삭제된 기록카드는 다시 복구할 수 없어요.{'\n'}삭제를 진행할까요?
              </CustomText>

              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={[styles.deleteModalButton]}
                  onPress={handleCancelDelete}>
                  <CustomText style={styles.cancelDeleteButtonText}>
                    취소하기
                  </CustomText>
                </TouchableOpacity>

                <View style={styles.buttonDivider} />

                <TouchableOpacity
                  style={[styles.deleteModalButton]}
                  onPress={handleConfirmDelete}>
                  <CustomText style={styles.confirmDeleteButtonText}>
                    삭제하기
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    moreButton: {
      padding: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'flex-end',
    },
    actionSheetContainer: {
      paddingHorizontal: 8,
      paddingBottom: 8,
    },
    actionSheet: {
      backgroundColor: colors[theme].GRAY_100,
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 8,
    },
    actionButton: {
      backgroundColor: colors[theme].WHITE,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderBottomColor: colors[theme].GRAY_200,
    },
    editButton: {
      borderBottomWidth: 0,
    },
    deleteButtonText: {
      fontSize: 20,
      color: colors[theme].RED_500,
      fontWeight: '400',
    },
    editButtonText: {
      fontSize: 20,
      color: colors[theme].BLUE_500,
      fontWeight: '400',
    },
    cancelButton: {
      backgroundColor: colors[theme].WHITE,
      paddingVertical: 16,
      alignItems: 'center',
      borderRadius: 14,
    },
    cancelButtonText: {
      fontSize: 20,
      color: colors[theme].BLUE_500,
      fontWeight: '600',
    },
    deleteModalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    deleteModal: {
      backgroundColor: colors[theme].WHITE,
      borderRadius: 14,
      paddingTop: 24,
      paddingBottom: 12,
      width: '100%',
      maxWidth: 320,
    },
    deleteModalTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: colors[theme].BLACK,
      textAlign: 'center',
      marginBottom: 8,
    },
    deleteModalMessage: {
      fontSize: 13,
      color: colors[theme].GRAY_700,
      textAlign: 'center',
      lineHeight: 18,
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    deleteModalButtons: {
      flexDirection: 'row',
      borderTopWidth: 0.5,
      borderTopColor: colors[theme].GRAY_300,
    },
    deleteModalButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonDivider: {
      width: 0.5,
      backgroundColor: colors[theme].GRAY_300,
    },
    cancelDeleteButtonText: {
      fontSize: 17,
      color: colors[theme].GRAY_700,
      fontWeight: '400',
    },
    confirmDeleteButtonText: {
      fontSize: 17,
      color: colors[theme].BLACK,
      fontWeight: '600',
    },
  });

export default RecordActionMenu;

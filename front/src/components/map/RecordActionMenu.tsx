import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Modal,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from '../common/CustomText';
import CommonActionSheet from '../common/CommonActionSheet';

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

  // DeleteModal 애니메이션 값들
  const deleteModalOpacity = useRef(new Animated.Value(0)).current;
  const deleteModalScale = useRef(new Animated.Value(0.8)).current;

  // DeleteModal 애니메이션 함수들
  const showDeleteModalAnimation = () => {
    setShowDeleteModal(true);
    // 애니메이션 시작 전 초기값 설정
    deleteModalOpacity.setValue(0);
    deleteModalScale.setValue(0.8);

    Animated.parallel([
      Animated.timing(deleteModalOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(deleteModalScale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideDeleteModalAnimation = () => {
    Animated.parallel([
      Animated.timing(deleteModalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(deleteModalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDeleteModal(false);
      // 애니메이션 완료 후 초기값으로 리셋
      deleteModalOpacity.setValue(0);
      deleteModalScale.setValue(0.8);
    });
  };

  const handleMorePress = () => {
    setShowActionSheet(true);
  };

  const handleEdit = () => {
    onEdit?.(recordId);
  };

  const handleDeletePress = () => {
    // ActionSheet가 닫힌 후 삭제 확인 모달 표시
    setTimeout(() => {
      showDeleteModalAnimation();
    }, 300);
  };

  const handleConfirmDelete = () => {
    hideDeleteModalAnimation();
    onDelete?.(recordId);
  };

  const handleCancelDelete = () => {
    hideDeleteModalAnimation();
  };

  const handleCloseActionSheet = () => {
    // 취소 버튼 클릭 시 별도 액션 없음
  };

  // ActionSheet 액션들 정의
  const actionSheetActions = [
    {
      text: '삭제하기',
      onPress: handleDeletePress,
      isDanger: true,
    },
    {
      text: '수정하기',
      onPress: handleEdit,
    },
    {
      text: '취소',
      onPress: handleCloseActionSheet,
      isCancel: true,
    },
  ];

  return (
    <>
      <TouchableOpacity
        onPress={handleMorePress}
        style={styles.moreButton}
        activeOpacity={0.7}>
        <FontAwesome6
          name="ellipsis"
          size={16}
          color={colors[theme].GRAY_500}
          iconStyle="solid"
        />
      </TouchableOpacity>

      {/* 공통 ActionSheet */}
      <CommonActionSheet
        isVisible={showActionSheet}
        onClose={handleCloseActionSheet}
        actions={actionSheetActions}
      />

      {/* 삭제 확인 모달 */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="none"
        onRequestClose={handleCancelDelete}>
        <Pressable style={styles.modalOverlay} onPress={handleCancelDelete}>
          {/* 배경 */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                opacity: deleteModalOpacity,
              },
            ]}
          />

          {/* DeleteModal 컨테이너 */}
          <View style={styles.deleteModalContainer}>
            <Pressable onPress={e => e.stopPropagation()}>
              <Animated.View
                style={[
                  styles.deleteModal,
                  {
                    transform: [{scale: deleteModalScale}],
                    opacity: deleteModalOpacity,
                  },
                ]}>
                <CustomText style={styles.deleteModalTitle}>
                  기록카드를 삭제할까요?
                </CustomText>
                <CustomText style={styles.deleteModalMessage}>
                  삭제된 기록카드는 다시 복구할 수 없어요.{'\n'}삭제를
                  진행할까요?
                </CustomText>

                <View style={styles.deleteModalButtons}>
                  <TouchableHighlight
                    style={[styles.deleteModalButton]}
                    underlayColor={colors[theme].GRAY_200}
                    onPress={handleCancelDelete}>
                    <CustomText style={styles.cancelDeleteButtonText}>
                      취소하기
                    </CustomText>
                  </TouchableHighlight>

                  <View style={styles.buttonDivider} />

                  <TouchableHighlight
                    style={[styles.deleteModalButton]}
                    underlayColor={colors[theme].GRAY_200}
                    onPress={handleConfirmDelete}>
                    <CustomText style={styles.confirmDeleteButtonText}>
                      삭제하기
                    </CustomText>
                  </TouchableHighlight>
                </View>
              </Animated.View>
            </Pressable>
          </View>
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
      justifyContent: 'flex-end',
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

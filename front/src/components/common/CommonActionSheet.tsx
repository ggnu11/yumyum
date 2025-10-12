import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Modal,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from './CustomText';

interface CommonActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  actions: ActionItem[];
}

interface ActionItem {
  text: string;
  onPress: () => void;
  isDanger?: boolean;
  isCancel?: boolean;
}

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

function CommonActionSheet({
  isVisible,
  onClose,
  actions,
}: CommonActionSheetProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  // 애니메이션 값들
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const containerTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // 애니메이션 함수들
  const showAnimation = () => {
    // 애니메이션 시작 전 초기값 설정
    backgroundOpacity.setValue(0);
    containerTranslateY.setValue(SCREEN_HEIGHT);

    Animated.parallel([
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(containerTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideAnimation = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(containerTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션 완료 후 초기값으로 리셋
      backgroundOpacity.setValue(0);
      containerTranslateY.setValue(SCREEN_HEIGHT);
      callback?.();
    });
  };

  const handleClose = () => {
    hideAnimation(() => {
      onClose();
    });
  };

  useEffect(() => {
    if (isVisible) {
      showAnimation();
    }
  }, [isVisible]);

  // 액션들을 분리 (취소 버튼과 일반 액션들)
  const cancelAction = actions.find(action => action.isCancel);
  const normalActions = actions.filter(action => !action.isCancel);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}>
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        {/* 배경 */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              opacity: backgroundOpacity,
            },
          ]}
        />

        {/* ActionSheet 컨테이너 */}
        <Animated.View
          style={[
            styles.actionSheetContainer,
            {
              transform: [{translateY: containerTranslateY}],
            },
          ]}>
          <Pressable onPress={e => e.stopPropagation()}>
            {/* 일반 액션들 */}
            <View style={styles.actionSheet}>
              {normalActions.map((action, index) => (
                <React.Fragment key={index}>
                  <TouchableHighlight
                    style={styles.actionButton}
                    underlayColor={colors[theme].GRAY_200}
                    onPress={() => {
                      hideAnimation(() => {
                        action.onPress();
                      });
                    }}>
                    <CustomText
                      style={[
                        styles.actionText,
                        action.isDanger && styles.dangerText,
                      ]}>
                      {action.text}
                    </CustomText>
                  </TouchableHighlight>
                  {index < normalActions.length - 1 && (
                    <View style={styles.actionDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>

            {/* 취소 버튼 */}
            {cancelAction && (
              <View style={styles.actionSheet}>
                <TouchableHighlight
                  style={styles.actionButton}
                  underlayColor={colors[theme].GRAY_200}
                  onPress={() => {
                    hideAnimation(() => {
                      cancelAction.onPress();
                    });
                  }}>
                  <CustomText style={styles.actionText}>
                    {cancelAction.text}
                  </CustomText>
                </TouchableHighlight>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    actionSheetContainer: {
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    actionSheet: {
      backgroundColor: colors[theme].GRAY_100,
      borderRadius: 15,
      overflow: 'hidden',
      marginBottom: 10,
    },
    actionButton: {
      backgroundColor: colors[theme].WHITE,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionDivider: {
      height: 0.5,
      backgroundColor: colors[theme].GRAY_200,
    },
    actionText: {
      fontSize: 17,
      color: colors[theme].BLUE_500,
      fontWeight: '500',
    },
    dangerText: {
      color: colors[theme].RED_500,
    },
  });

export default CommonActionSheet;

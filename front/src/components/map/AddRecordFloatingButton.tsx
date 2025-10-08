import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from '../common/CustomText';

interface AddRecordFloatingButtonProps {
  onPress?: () => void;
  isVisible?: boolean;
}

const {width: screenWidth} = Dimensions.get('window');

function AddRecordFloatingButton({
  onPress,
  isVisible = true,
}: AddRecordFloatingButtonProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const translateY = useRef(new Animated.Value(200)).current; // 화면 아래로 시작

  useEffect(() => {
    if (isVisible) {
      // 바텀시트가 열릴 때: 동시에 나타남
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250, // 바텀시트와 동일한 속도
        delay: 0, // 동시에 시작
        easing: Easing.out(Easing.ease), // 바텀시트와 동일한 easing
        useNativeDriver: true,
      }).start();
    } else {
      // 바텀시트가 닫힐 때: 동시에 사라짐
      Animated.timing(translateY, {
        toValue: 200,
        duration: 250, // 바텀시트와 동일한 속도
        delay: 0, // 동시에 시작
        easing: Easing.in(Easing.ease), // 바텀시트와 동일한 easing
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, translateY]);

  return (
    <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Ionicons
          name="add"
          size={20}
          color={colors[theme].WHITE}
          style={styles.icon}
        />
        <CustomText style={styles.buttonText}>기록 추가하기</CustomText>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 20, // 바텀시트 위에 위치하도록 조정
      left: 20,
      right: 20,
      zIndex: 11, // 바텀시트보다 위에 표시
    },
    button: {
      backgroundColor: colors[theme].BLACK,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      shadowColor: colors[theme].BLACK,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    icon: {
      marginRight: 8,
    },
    buttonText: {
      color: colors[theme].WHITE,
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default AddRecordFloatingButton;

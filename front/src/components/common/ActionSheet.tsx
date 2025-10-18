import Ionicons from '@react-native-vector-icons/ionicons';
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useRef,
  useEffect,
} from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Modal,
  ModalProps,
  Pressable,
  PressableProps,
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import CustomText from './CustomText';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

interface ActionSheetContextValue {
  onPressOutSide?: (event: GestureResponderEvent) => void;
  backgroundOpacity?: Animated.Value;
  containerTranslateY?: Animated.Value;
}

const ActionSheetContext = createContext<ActionSheetContextValue | undefined>(
  undefined,
);

interface ActionMainProps extends ModalProps {
  children: ReactNode;
  isVisible: boolean;
  hideAction: () => void;
  animationType?: ModalProps['animationType'];
}

function ActionMain({
  children,
  isVisible,
  animationType = 'none',
  hideAction,
  ...props
}: ActionMainProps) {
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const containerTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isVisible) {
      // 열기 애니메이션
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
    } else {
      // 닫기 애니메이션
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
      ]).start();
    }
  }, [isVisible, backgroundOpacity, containerTranslateY]);

  const onPressOutSide = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      hideAction();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType={animationType}
      onRequestClose={hideAction}
      {...props}>
      <ActionSheetContext
        value={{onPressOutSide, backgroundOpacity, containerTranslateY}}>
        {children}
      </ActionSheetContext>
    </Modal>
  );
}

function Background({children}: PropsWithChildren) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const actionSheetContext = useContext(ActionSheetContext);

  return (
    <Pressable
      style={styles.actionBackground}
      onPress={actionSheetContext?.onPressOutSide}>
      {/* 배경 */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: actionSheetContext?.backgroundOpacity || 1,
          },
        ]}
      />

      {/* 컨테이너 */}
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [
              {translateY: actionSheetContext?.containerTranslateY || 0},
            ],
          },
        ]}>
        <Pressable onPress={e => e.stopPropagation()}>
          <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

function Container({children}: PropsWithChildren) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return <View style={styles.actionContainer}>{children}</View>;
}

interface ButtonProps {
  children: ReactNode;
  isDanger?: boolean;
  isChecked?: boolean;
  onPress?: () => void;
}

function Button({
  children,
  isDanger = false,
  isChecked = false,
  ...props
}: ButtonProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <TouchableHighlight
      style={styles.actionButton}
      underlayColor={colors[theme].GRAY_200}
      {...props}>
      <View style={styles.actionButtonContent}>
        <CustomText style={[styles.actionText, isDanger && styles.dangerText]}>
          {children}
        </CustomText>

        {isChecked && (
          <Ionicons name="checkmark" size={20} color={colors[theme].BLUE_500} />
        )}
      </View>
    </TouchableHighlight>
  );
}

function Title({children}: PropsWithChildren) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.titleContainer}>
      <CustomText style={styles.titleText}>{children}</CustomText>
    </View>
  );
}

function Divider() {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return <View style={styles.border} />;
}

interface FilterProps extends PressableProps {
  children: ReactNode;
  isSelected?: boolean;
}

function Filter({children, isSelected, ...props}: FilterProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <Pressable style={styles.filterContainer} {...props}>
      <CustomText
        style={isSelected ? styles.filterSelectedText : styles.filterText}>
        {children}
      </CustomText>
      <Ionicons
        name="chevron-down"
        size={22}
        color={isSelected ? colors[theme].BLUE_500 : colors[theme].GRAY_300}
      />
    </Pressable>
  );
}

interface CheckBoxProps {
  children?: ReactNode;
  icon?: ReactNode;
  isChecked?: boolean;
  onPress?: () => void;
}

function CheckBox({
  children,
  icon = null,
  isChecked = false,
  ...props
}: CheckBoxProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <TouchableHighlight
      style={styles.checkBoxContainer}
      underlayColor={colors[theme].GRAY_200}
      {...props}>
      <View style={styles.checkBoxContent}>
        <Ionicons
          size={22}
          color={colors[theme].BLUE_500}
          name={isChecked ? 'checkmark-circle' : 'checkmark-circle-outline'}
        />
        {icon}
        <CustomText style={styles.checkBoxText}>{children}</CustomText>
      </View>
    </TouchableHighlight>
  );
}

export const ActionSheet = Object.assign(ActionMain, {
  Container,
  Button,
  Title,
  Divider,
  Background,
  Filter,
  CheckBox,
});

const styling = (theme: Theme) =>
  StyleSheet.create({
    actionBackground: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    animatedContainer: {
      justifyContent: 'flex-end',
    },
    safeArea: {
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    actionContainer: {
      backgroundColor: colors[theme].GRAY_100,
      overflow: 'hidden',
      borderRadius: 15,
      marginBottom: 10,
    },
    actionButton: {
      height: 50,
    },
    actionButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      gap: 5,
    },
    actionText: {
      fontSize: 17,
      color: colors[theme].BLUE_500,
      fontWeight: '500',
    },
    dangerText: {
      color: colors[theme].RED_500,
    },
    titleContainer: {
      padding: 15,
      alignItems: 'center',
    },
    titleText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors[theme].BLACK,
    },
    border: {
      borderBottomColor: colors[theme].GRAY_200,
      borderBottomWidth: 1,
    },
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      gap: 5,
    },
    filterText: {
      color: colors[theme].GRAY_300,
      fontSize: 15,
      fontWeight: '500',
    },
    filterSelectedText: {
      color: colors[theme].BLUE_500,
      fontSize: 15,
      fontWeight: '500',
    },
    checkBoxContainer: {
      paddingVertical: 10,
      paddingHorizontal: 30,
    },
    checkBoxContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    checkBoxText: {
      color: colors[theme].BLACK,
      fontSize: 15,
    },
  });

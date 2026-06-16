import Ionicons from '@react-native-vector-icons/ionicons';
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
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
  Text,
  View,
} from 'react-native';

import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';

interface ActionSheetContextValue {
  onPressOutSide?: (event: GestureResponderEvent) => void;
  slideAnim: Animated.Value;
}

const ActionSheetContext = createContext<ActionSheetContextValue | undefined>(
  undefined,
);

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface ActionMainProps extends ModalProps {
  children: ReactNode;
  isVisible: boolean;
  hideAction: () => void;
  animationType?: ModalProps['animationType'];
}

function ActionMain({
  children,
  isVisible,
  hideAction,
  ...props
}: ActionMainProps) {
  const [modalVisible, setModalVisible] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [isVisible]);

  const onPressOutSide = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      hideAction();
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={hideAction}
      {...props}>
      <ActionSheetContext value={{onPressOutSide, slideAnim}}>
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
    <SafeAreaView
      style={styles.actionBackground}
      onTouchEnd={actionSheetContext?.onPressOutSide}>
      <Animated.View
        style={{transform: [{translateY: actionSheetContext?.slideAnim ?? 0}]}}>
        {children}
      </Animated.View>
    </SafeAreaView>
  );
}

function Container({children}: PropsWithChildren) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return <View style={styles.actionContainer}>{children}</View>;
}

interface ButtonProps extends PressableProps {
  children: ReactNode;
  isDanger?: boolean;
  isChecked?: boolean;
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
    <Pressable
      style={({pressed}) => [
        pressed && styles.actionButtonPressed,
        styles.actionButton,
      ]}
      {...props}>
      <Text style={[styles.actionText, isDanger && styles.dangerText]}>
        {children}
      </Text>

      {isChecked && (
        <Ionicons name="checkmark" size={20} color={colors[theme].BLUE_500} />
      )}
    </Pressable>
  );
}

function Title({children}: PropsWithChildren) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{children}</Text>
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
      <Text style={isSelected ? styles.filterSelectedText : styles.filterText}>
        {children}
      </Text>
      <Ionicons
        name="chevron-down"
        size={22}
        color={isSelected ? colors[theme].BLUE_500 : colors[theme].GRAY_300}
      />
    </Pressable>
  );
}

interface CheckBoxProps extends PressableProps {
  children?: ReactNode;
  icon?: ReactNode;
  isChecked?: boolean;
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
    <Pressable
      {...props}
      style={({pressed}) => [
        pressed && styles.actionButtonPressed,
        styles.checkBoxContainer,
      ]}>
      <Ionicons
        size={22}
        color={colors[theme].BLUE_500}
        name={isChecked ? 'checkmark-circle' : 'checkmark-circle-outline'}
      />
      {icon}
      <Text style={styles.checkBoxText}>{children}</Text>
    </Pressable>
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
      backgroundColor: 'rgba(0 0 0 / 0.5)',
    },
    actionContainer: {
      backgroundColor: colors[theme].GRAY_100,
      overflow: 'hidden',
      borderRadius: 15,
      marginHorizontal: 10,
      marginBottom: 10,
    },
    actionButtonPressed: {
      backgroundColor: colors[theme].GRAY_200,
    },
    actionButton: {
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
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 30,
      gap: 10,
    },
    checkBoxText: {
      color: colors[theme].BLACK,
      fontSize: 15,
    },
  });

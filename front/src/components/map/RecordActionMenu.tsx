import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Ionicons from '@react-native-vector-icons/ionicons';
import React, {useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';

import {colors} from '../../constants/colors';
import useThemeStore, {Theme} from '../../store/theme';
import CustomText from '../common/CustomText';

interface RecordActionMenuProps {
  recordId: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

function RecordActionMenu({recordId, onEdit, onDelete}: RecordActionMenuProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const [showMenu, setShowMenu] = useState(false);

  const handleMorePress = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    setShowMenu(false);
    onEdit?.(recordId);
  };

  const handleDelete = () => {
    setShowMenu(false);
    Alert.alert('기록 삭제', '이 기록을 정말 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => onDelete?.(recordId),
      },
    ]);
  };

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity onPress={handleMorePress} style={styles.moreButton}>
        <FontAwesome6
          name="ellipsis"
          size={16}
          color={colors[theme].GRAY_500}
          iconStyle="solid"
        />
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={handleEdit} style={styles.menuItem}>
            <Ionicons
              name="create-outline"
              size={16}
              color={colors[theme].GRAY_700}
            />
            <CustomText style={styles.menuText}>수정하기</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
            <Ionicons
              name="trash-outline"
              size={16}
              color={colors[theme].RED_500}
            />
            <CustomText style={[styles.menuText, styles.deleteText]}>
              삭제하기
            </CustomText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    menuContainer: {
      position: 'relative',
    },
    moreButton: {
      padding: 8,
    },
    dropdown: {
      position: 'absolute',
      top: 32,
      left: 5,
      backgroundColor: colors[theme].WHITE,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors[theme].GRAY_200,
      shadowColor: colors[theme].BLACK,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 10,
      minWidth: 120,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
    },
    menuText: {
      fontSize: 14,
      color: colors[theme].GRAY_700,
    },
    deleteText: {
      color: colors[theme].RED_500,
    },
  });

export default RecordActionMenu;

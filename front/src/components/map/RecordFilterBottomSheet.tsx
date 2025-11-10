import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {colors} from '../../constants/colors';
import {layout} from '../../constants/layout';
import CustomText from '../common/CustomText';

interface RecordFilterBottomSheetProps {
  onApply?: (selectedFilters: string[]) => void;
}

const FILTER_OPTIONS = [
  {id: 'all', label: '모두 보기'},
  {id: 'mine', label: '나만 보기'},
  {id: 'friend', label: '친구'},
  {id: 'group1', label: '그룹1이름'},
  {id: 'group2', label: '그룹2이름'},
  {id: 'group3', label: '그룹3이름'},
];

const RecordFilterBottomSheet = forwardRef<
  BottomSheet,
  RecordFilterBottomSheetProps
>(({onApply}, ref) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
  const snapPoints = useMemo(() => ['50%'], []);

  const handleFilterToggle = useCallback((filterId: string) => {
    setSelectedFilters(prev => {
      // '모두 보기' 선택 시
      if (filterId === 'all') {
        return ['all'];
      }

      // 다른 필터 선택 시
      const withoutAll = prev.filter(id => id !== 'all');

      if (withoutAll.includes(filterId)) {
        // 이미 선택된 필터 해제
        const newFilters = withoutAll.filter(id => id !== filterId);
        return newFilters.length === 0 ? ['all'] : newFilters;
      } else {
        // 새로운 필터 추가
        return [...withoutAll, filterId];
      }
    });
  }, []);

  const handleApply = useCallback(() => {
    if (onApply) {
      onApply(selectedFilters);
    }
    if (ref && 'current' in ref && ref.current) {
      ref.current.close();
    }
  }, [selectedFilters, onApply, ref]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      style={{
        zIndex: 99999,
        elevation: 99999,
      }}
      backgroundStyle={{
        backgroundColor: colors.light.WHITE,
        borderTopLeftRadius: layout.ios.bottomsheet.rounding,
        borderTopRightRadius: layout.ios.bottomsheet.rounding,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.light.GRAY_300,
        width: 40,
      }}>
      <BottomSheetView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <CustomText style={styles.title}>기록카드 필터</CustomText>
          <TouchableOpacity onPress={handleApply} style={styles.doneButton}>
            <CustomText style={styles.doneButtonText}>완료</CustomText>
          </TouchableOpacity>
        </View>

        {/* 필터 옵션들 */}
        <View style={styles.filterList}>
          {FILTER_OPTIONS.map(option => {
            const isSelected = selectedFilters.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.filterOption}
                onPress={() => handleFilterToggle(option.id)}>
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.light.WHITE}
                    />
                  )}
                </View>
                <CustomText style={styles.filterLabel}>
                  {option.label}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layout.ios.bottomsheet.margin,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.GRAY_200,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.BLACK,
  },
  doneButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  doneButtonText: {
    fontSize: 16,
    color: colors.light.BLUE_500,
    fontWeight: '600',
  },
  filterList: {
    gap: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.light.GRAY_300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.WHITE,
  },
  checkboxSelected: {
    backgroundColor: colors.light.BLUE_500,
    borderColor: colors.light.BLUE_500,
  },
  filterLabel: {
    fontSize: 16,
    color: colors.light.BLACK,
  },
});

RecordFilterBottomSheet.displayName = 'RecordFilterBottomSheet';

export default RecordFilterBottomSheet;

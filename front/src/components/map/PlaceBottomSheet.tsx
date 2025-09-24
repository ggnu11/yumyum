import React, {forwardRef, useState, useMemo, useCallback} from 'react';
import {View, Text} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {colors} from '../../constants/colors';
import {
  usePlacePins,
  usePlaceInfo,
  useFilteredRecords,
} from '../../hooks/usePin';
import {PlaceInfo as ApiPlaceInfo} from '../../types/api';
import PlaceSummaryView from './PlaceSummaryView';
import FeedFilterSection from './FeedFilterSection';
import RecordsList from './RecordsList';
import AddRecordButton from './AddRecordButton';

export type FilterType = 'mine' | 'all';

interface PlaceBottomSheetProps {
  placeInfo: ApiPlaceInfo | null;
  onClose?: () => void;
  onAddRecord?: (placeId: string) => void;
  onEditRecord?: (recordId: number) => void;
  onDeleteRecord?: (recordId: number) => void;
}

const PlaceBottomSheet = forwardRef<BottomSheet, PlaceBottomSheetProps>(
  ({placeInfo, onClose, onAddRecord, onEditRecord, onDeleteRecord}, ref) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('mine');

    // API 호출 - 장소의 핀 목록 조회
    const {
      data: allRecords = [],
      isLoading: isPinsLoading,
      error: pinsError,
    } = usePlacePins(placeInfo?.place_id || '', {
      enabled: !!placeInfo?.place_id,
    });

    // 필터링된 레코드
    const filteredRecords = useFilteredRecords(allRecords, activeFilter);

    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    const handleSheetChanges = useCallback((index: number) => {
      // Bottom sheet 상태 변경 처리
      console.log('handleSheetChanges', index);
    }, []);

    if (!placeInfo) {
      return null;
    }

    return (
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: colors.light.WHITE,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.light.GRAY_300,
          width: 40,
        }}>
        <BottomSheetView style={{flex: 1, paddingHorizontal: 20}}>
          <PlaceSummaryView placeInfo={placeInfo} />

          <View
            style={{
              height: 1,
              backgroundColor: colors.light.GRAY_200,
              marginVertical: 20,
            }}
          />

          <BottomSheetScrollView
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}>
            <FeedFilterSection
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {isPinsLoading ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={{color: colors.light.GRAY_500}}>
                  기록을 불러오는 중...
                </Text>
              </View>
            ) : pinsError ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={{color: colors.light.RED_500}}>
                  기록을 불러오는데 실패했습니다.
                </Text>
              </View>
            ) : (
              <RecordsList
                records={filteredRecords}
                activeFilter={activeFilter}
                onEditRecord={onEditRecord}
                onDeleteRecord={onDeleteRecord}
              />
            )}
          </BottomSheetScrollView>

          <AddRecordButton onPress={() => onAddRecord?.(placeInfo?.place_id)} />
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

PlaceBottomSheet.displayName = 'PlaceBottomSheet';

export default PlaceBottomSheet;

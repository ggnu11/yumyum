import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {colors} from '../../constants/colors';
import {useFilteredRecords, usePlacePins} from '../../hooks/usePin';
import {PlaceInfo as ApiPlaceInfo} from '../../types/api';
import CustomText from '../common/CustomText';
import FeedFilterSection from './FeedFilterSection';
import PlaceSummaryView from './PlaceSummaryView';
import RecordsList from './RecordsList';

export type FilterType = 'mine' | 'all';

interface PlaceBottomSheetProps {
  placeInfo: ApiPlaceInfo | null;
  onClose?: () => void;
  onSheetChange?: (index: number) => void;
  onSheetAnimate?: (fromIndex: number, toIndex: number) => void;
  onAddRecord?: (placeId: string) => void;
  onEditRecord?: (recordId: number) => void;
  onDeleteRecord?: (recordId: number) => void;
}

const PlaceBottomSheet = forwardRef<BottomSheet, PlaceBottomSheetProps>(
  (
    {
      placeInfo,
      onClose,
      onSheetChange,
      onSheetAnimate,
      onAddRecord,
      onEditRecord,
      onDeleteRecord,
    },
    ref,
  ) => {
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

    const snapPoints = useMemo(() => [397, '100%'], []);

    const handleSheetChanges = useCallback(
      (index: number) => {
        // Bottom sheet 상태 변경 처리
        console.log('handleSheetChanges', index);

        // 상태 변경을 부모 컴포넌트에 알림
        if (onSheetChange) {
          onSheetChange(index);
        }

        // 바텀시트가 완전히 닫혔을 때 (-1) onClose 콜백 호출
        if (index === -1 && onClose) {
          onClose();
        }
      },
      [onClose, onSheetChange],
    );

    const handleSheetAnimate = useCallback(
      (fromIndex: number, toIndex: number) => {
        if (onSheetAnimate) {
          onSheetAnimate(fromIndex, toIndex);
        }
      },
      [onSheetAnimate],
    );

    if (!placeInfo) {
      return null;
    }

    return (
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onAnimate={handleSheetAnimate}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
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
              placeName={placeInfo.place_name}
            />

            {isPinsLoading ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <CustomText style={{color: colors.light.GRAY_500}}>
                  기록을 불러오는 중...
                </CustomText>
              </View>
            ) : pinsError ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <CustomText style={{color: colors.light.RED_500}}>
                  기록을 불러오는데 실패했습니다.
                </CustomText>
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
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

PlaceBottomSheet.displayName = 'PlaceBottomSheet';

export default PlaceBottomSheet;

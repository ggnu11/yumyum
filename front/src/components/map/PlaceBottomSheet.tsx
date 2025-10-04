import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {colors} from '../../constants/colors';
import {useFilteredRecords, usePlacePins} from '../../hooks/usePin';
import {PlaceInfo as ApiPlaceInfo} from '../../types/api';
import CusmtomText from '../common/CustomText';
import AddRecordButton from './AddRecordButton';
import FeedFilterSection from './FeedFilterSection';
import PlaceSummaryView from './PlaceSummaryView';
import RecordsList from './RecordsList';

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

    // 모든 기록들의 이미지 추출
    const recordImages = allRecords
      .flatMap(record => record.images || [])
      .filter((image, index, self) => self.indexOf(image) === index); // 중복 제거

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
          <PlaceSummaryView placeInfo={placeInfo} recordImages={recordImages} />

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
                <CusmtomText style={{color: colors.light.GRAY_500}}>
                  기록을 불러오는 중...
                </CusmtomText>
              </View>
            ) : pinsError ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <CusmtomText style={{color: colors.light.RED_500}}>
                  기록을 불러오는데 실패했습니다.
                </CusmtomText>
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

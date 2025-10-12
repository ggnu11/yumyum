import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useMemo, useState, useRef} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {colors} from '../../constants/colors';
import {usePlacePins} from '../../hooks/usePin';
import {PlaceInfo as ApiPlaceInfo} from '../../types/api';
import CustomText from '../common/CustomText';
import PlaceSummaryView from './PlaceSummaryView';
import RecordsList from './RecordsList';
import RecordFilterBottomSheet from './RecordFilterBottomSheet';

// 목업 데이터
const MOCK_RECORDS = [
  {
    id: 1,
    title: '행복한불고기321',
    content:
      '민주랑 함께 간단하게 점심 먹으러 갔는데 생각보다 너무 마음에 들었던 집! 겨울마다 와야지~',
    date: '2025.09.25',
    images: [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
      'https://picsum.photos/400/300?random=3',
    ],
    isOwner: true,
    categories: ['내 카드'],
  },
  {
    id: 2,
    title: '다정한코알라175',
    content:
      '원래 데이스 코스로 알아둔 가게들이 모두 영업을 안 해서 급하게 유겨찾던 곳. 의외로 맛집이라 오히려 좋았다!',
    date: '2025.09.20',
    images: [
      'https://picsum.photos/400/300?random=4',
      'https://picsum.photos/400/300?random=5',
      'https://picsum.photos/400/300?random=6',
      'https://picsum.photos/400/300?random=7',
    ],
    isOwner: false,
    author: {
      name: '다정한코알라175',
      profileImage: 'https://picsum.photos/100/100?random=10',
    },
    categories: ['외 +1'],
  },
  {
    id: 3,
    title: '행복한불고기321',
    content:
      '원래 데이스 코스로 알아둔 가게들이 모두 영업을 안 해서 급하게 유겨찾던 곳. 의외로 맛집이라 오히려 좋았다!',
    date: '2025.09.20',
    images: [
      'https://picsum.photos/400/300?random=8',
      'https://picsum.photos/400/300?random=9',
    ],
    isOwner: true,
    categories: ['외 +2'],
  },
];

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

const styles = StyleSheet.create({
  topSafeArea: {
    height: 44,
    backgroundColor: colors.light.WHITE,
  },
  expandedHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.light.WHITE,
  },
  fullViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    padding: 4,
  },
  bookmarkButton: {
    padding: 4,
  },
  stickyHeaderContainer: {
    backgroundColor: colors.light.WHITE,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.GRAY_200,
  },
  recordsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.BLACK,
    marginBottom: 4,
  },
  recordsSubtitle: {
    fontSize: 14,
    color: colors.light.BLUE_100,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.light.GRAY_700,
  },
  recordsListContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  divider: {
    height: 8,
    backgroundColor: colors.light.GRAY_100,
    marginHorizontal: -20,
  },
});

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
    const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
    const filterBottomSheetRef = useRef<BottomSheet>(null);

    // API 호출 - 장소의 핀 목록 조회
    const {
      data: apiRecords = [],
      isLoading: isPinsLoading,
      error: pinsError,
    } = usePlacePins(placeInfo?.place_id || '', {
      enabled: !!placeInfo?.place_id,
    });

    // API 데이터가 없거나 에러가 발생하면 목업 데이터 사용
    const allRecords =
      apiRecords.length > 0 && !pinsError ? apiRecords : MOCK_RECORDS;

    // 필터에 따라 레코드 필터링
    const filteredRecords = useMemo(() => {
      if (selectedFilters.includes('all')) {
        return allRecords;
      }
      if (selectedFilters.includes('mine')) {
        return allRecords.filter(record => record.isOwner);
      }
      // TODO: 실제 필터링 로직 구현
      return allRecords;
    }, [allRecords, selectedFilters]);

    const snapPoints = useMemo(() => [397, '100%'], []);

    const handleSheetChanges = useCallback(
      (index: number) => {
        // Bottom sheet 상태 변경 처리
        console.log('handleSheetChanges', index);
        setCurrentSheetIndex(index);

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
        // 애니메이션 시작 시 즉시 상태 업데이트
        setCurrentSheetIndex(toIndex);

        if (onSheetAnimate) {
          onSheetAnimate(fromIndex, toIndex);
        }
      },
      [onSheetAnimate],
    );

    const handleOpenFilterSheet = useCallback(() => {
      filterBottomSheetRef.current?.snapToIndex(0);
    }, []);

    const handleApplyFilter = useCallback((filters: string[]) => {
      setSelectedFilters(filters);
    }, []);

    const getFilterLabel = useCallback(() => {
      if (selectedFilters.includes('all')) {
        return '모두 보기';
      }
      if (selectedFilters.length === 1) {
        const filterOption = [
          {id: 'mine', label: '나만 보기'},
          {id: 'friend', label: '친구'},
          {id: 'group10', label: '그룹10들'},
          {id: 'group20', label: '그룹20들'},
          {id: 'group30', label: '그룹30들'},
        ].find(f => f.id === selectedFilters[0]);
        return filterOption?.label || '모두 보기';
      }
      return `${selectedFilters.length}개 선택`;
    }, [selectedFilters]);

    if (!placeInfo) {
      return null;
    }

    return (
      <>
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
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={currentSheetIndex === 1 ? [0] : undefined}
            contentContainerStyle={{
              flexGrow: 1,
            }}>
            {/* 100% 확장 시 상단 헤더 */}
            {currentSheetIndex === 1 && (
              <View>
                {/* Safe Area */}
                <View style={styles.topSafeArea} />

                {/* 헤더 영역 */}
                <View style={styles.expandedHeader}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                      ref && 'current' in ref && ref.current?.snapToIndex(0)
                    }>
                    <Ionicons
                      name="chevron-back"
                      size={24}
                      color={colors.light.BLACK}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.bookmarkButton}>
                    <Ionicons
                      name="star-outline"
                      size={24}
                      color={colors.light.GRAY_500}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 식당 정보 영역 */}
            <View
              style={{paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8}}>
              <PlaceSummaryView
                placeInfo={placeInfo}
                isExpanded={currentSheetIndex === 1}
              />
            </View>

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 기록카드 헤더 (Sticky) */}
            <View style={styles.stickyHeaderContainer}>
              <View style={styles.recordsHeader}>
                <View style={{flex: 1}}>
                  <CustomText style={styles.recordsTitle}>
                    이 장소에 등록된 기록카드
                  </CustomText>
                  <CustomText style={styles.recordsSubtitle}>
                    {placeInfo.place_name}에 대해 이야기 해 주세요!
                  </CustomText>
                </View>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={handleOpenFilterSheet}>
                  <CustomText style={styles.filterButtonText}>
                    {getFilterLabel()}
                  </CustomText>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={colors.light.GRAY_700}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 기록 리스트 */}
            <View style={styles.recordsListContainer}>
              {isPinsLoading ? (
                <View style={{padding: 20, alignItems: 'center'}}>
                  <CustomText style={{color: colors.light.GRAY_500}}>
                    기록을 불러오는 중...
                  </CustomText>
                </View>
              ) : (
                <RecordsList
                  records={filteredRecords}
                  activeFilter="all"
                  isExpanded={currentSheetIndex === 1}
                  onEditRecord={onEditRecord}
                  onDeleteRecord={onDeleteRecord}
                />
              )}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>

        {/* 필터 바텀시트 */}
        <RecordFilterBottomSheet
          ref={filterBottomSheetRef}
          onApply={handleApplyFilter}
        />
      </>
    );
  },
);

PlaceBottomSheet.displayName = 'PlaceBottomSheet';

export default PlaceBottomSheet;

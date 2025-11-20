import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Ionicons from '@react-native-vector-icons/ionicons';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';
import {colorSystem, colors} from '../../constants/colors';
import {layout} from '../../constants/layout';
import {usePlaceInfo, usePlacePins} from '../../hooks/usePin';
import {
  useCreateWishlist,
  useDeleteWishlist,
  useWishlistByPlaceId,
} from '../../hooks/queries/useWishlist';
import {PlaceInfo as ApiPlaceInfo, RecordData} from '../../types/api';
import CustomText from '../common/CustomText';
import PlaceSummaryView from './PlaceSummaryView';
import RecordsList from './RecordsList';
import Toast from 'react-native-toast-message';

// 목업 데이터 (더미 데이터 사용 시 필요 없음)
const MOCK_RECORDS: RecordData[] = [];

export type FilterType = 'mine' | 'all';

interface PlaceBottomSheetProps {
  placeInfo: ApiPlaceInfo | null;
  onClose?: () => void;
  onSheetChange?: (index: number) => void;
  onSheetAnimate?: (fromIndex: number, toIndex: number) => void;
  onAddRecord?: (placeId: string) => void;
  onEditRecord?: (recordId: number) => void;
  onDeleteRecord?: (recordId: number) => void;
  onOpenFilterSheet?: () => void;
  selectedFilters?: string[];
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
    paddingHorizontal: layout.ios.bottomsheet.margin,
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
    paddingHorizontal: layout.ios.bottomsheet.margin,
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
    paddingHorizontal: layout.ios.bottomsheet.margin,
    paddingTop: 12,
  },
  divider: {
    height: 8,
    backgroundColor: colors.light.GRAY_100,
    marginHorizontal: -layout.ios.bottomsheet.margin,
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
      onOpenFilterSheet,
      selectedFilters = ['mine'], // 기본값: 나만 보기
    },
    ref,
  ) => {
    const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
    const [wishId, setWishId] = useState<number | null>(null);

    // API 호출 - 장소 정보 조회 (my_wish_exists 포함)
    const {data: placeInfoData, isLoading: isPlaceInfoLoading} = usePlaceInfo(
      placeInfo?.place_id || '',
      {
        enabled: !!placeInfo?.place_id,
      },
    );

    // API 호출 - 장소의 핀 목록 조회
    const {
      data: apiRecords = [],
      isLoading: isPinsLoading,
      error: pinsError,
    } = usePlacePins(placeInfo?.place_id || '', {
      enabled: !!placeInfo?.place_id,
    });

    // 위시리스트 조회 (wish_id를 얻기 위해)
    const {data: wishlistData} = useWishlistByPlaceId(
      placeInfo?.place_id || '',
      {
        enabled:
          !!placeInfo?.place_id && (placeInfoData?.my_wish_exists ?? false),
      },
    );

    // 위시리스트 추가/삭제
    const createWishlist = useCreateWishlist();
    const deleteWishlist = useDeleteWishlist();

    // 위시리스트 상태 동기화
    useEffect(() => {
      if (wishlistData?.wish_id) {
        setWishId(wishlistData.wish_id);
      } else if (wishlistData === null) {
        // 명시적으로 null이면 위시리스트가 없음
        setWishId(null);
      }
    }, [wishlistData?.wish_id, wishlistData]);

    // 위시리스트 상태 (wishlistData 우선, 없으면 placeInfoData, 그 다음 placeInfo)
    const isBookmarked =
      wishlistData !== undefined
        ? wishlistData !== null
        : placeInfoData?.my_wish_exists ?? placeInfo?.my_wish_exists ?? false;
    const displayPlaceInfo = placeInfoData || placeInfo;

    // API 데이터가 없거나 에러가 발생하면 목업 데이터 사용
    const allRecords =
      apiRecords.length > 0 && !pinsError ? apiRecords : MOCK_RECORDS;

    // 필터에 따라 레코드 필터링 (기본값: 나만 보기)
    const defaultFilter =
      selectedFilters && selectedFilters.length > 0
        ? selectedFilters
        : ['mine'];

    const filteredRecords = useMemo(() => {
      const filters =
        selectedFilters && selectedFilters.length > 0
          ? selectedFilters
          : defaultFilter;

      if (filters.includes('all')) {
        return allRecords;
      }
      if (filters.includes('mine')) {
        return allRecords.filter(record => record.isOwner);
      }
      // TODO: 실제 필터링 로직 구현 (친구, 그룹 등)
      return allRecords;
    }, [allRecords, selectedFilters, defaultFilter]);

    // 위시리스트 토글 핸들러
    const handleWishlistToggle = useCallback(async () => {
      if (!placeInfo?.place_id) return;

      if (isBookmarked) {
        // 위시리스트 삭제
        if (wishId) {
          deleteWishlist.mutate(
            {wishId, placeId: placeInfo.place_id},
            {
              onSuccess: () => {
                Toast.show({
                  type: 'success',
                  text1: '위시리스트에서 제거되었습니다.',
                });
              },
              onError: () => {
                Toast.show({
                  type: 'error',
                  text1: '위시리스트 제거에 실패했습니다.',
                });
              },
            },
          );
        }
      } else {
        // 위시리스트 추가
        createWishlist.mutate(placeInfo.place_id, {
          onSuccess: data => {
            setWishId(data.wish_id);
            Toast.show({
              type: 'success',
              text1: '위시리스트에 추가되었습니다.',
            });
          },
          onError: () => {
            Toast.show({
              type: 'error',
              text1: '위시리스트 추가에 실패했습니다.',
            });
          },
        });
      }
    }, [
      isBookmarked,
      wishId,
      placeInfo?.place_id,
      createWishlist,
      deleteWishlist,
    ]);

    const snapPoints = useMemo(() => [300, '100%'], []);

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
      if (onOpenFilterSheet) {
        onOpenFilterSheet();
      }
    }, [onOpenFilterSheet]);

    const handleApplyFilter = useCallback((filters: string[]) => {
      // 필터 적용은 이제 부모 컴포넌트에서 처리
    }, []);

    const getFilterLabel = useCallback(() => {
      const filters =
        selectedFilters && selectedFilters.length > 0
          ? selectedFilters
          : ['mine'];

      if (filters.includes('all')) {
        return '모두 보기';
      }
      if (filters.includes('mine')) {
        return '나만 보기';
      }
      if (filters.length === 1) {
        const filterOption = [
          {id: 'friend', label: '친구'},
          {id: 'group1', label: '그룹1이름'},
          {id: 'group2', label: '그룹2이름'},
          {id: 'group3', label: '그룹3이름'},
        ].find(f => f.id === filters[0]);
        return filterOption?.label || '나만 보기';
      }
      return `${filters.length}개 선택`;
    }, [selectedFilters]);

    if (!placeInfo && !displayPlaceInfo) {
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
            borderTopLeftRadius: layout.ios.bottomsheet.rounding,
            borderTopRightRadius: layout.ios.bottomsheet.rounding,
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
                  <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={handleWishlistToggle}
                    disabled={
                      createWishlist.isPending || deleteWishlist.isPending
                    }>
                    <Image
                      source={require('@/assets/common/star.png')}
                      style={[
                        {
                          tintColor: isBookmarked
                            ? colorSystem.system.warning
                            : colorSystem.label.disable,
                        },
                      ]}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 식당 정보 영역 */}
            {displayPlaceInfo && (
              <View
                style={{
                  paddingHorizontal: layout.ios.bottomsheet.margin,
                  paddingBottom: 20,
                  paddingTop: 8,
                }}>
                <PlaceSummaryView
                  placeInfo={displayPlaceInfo}
                  isBookmarked={isBookmarked}
                  onBookmarkPress={handleWishlistToggle}
                  isExpanded={currentSheetIndex === 1}
                  pinInfo={
                    // TODO: 실제 핀 정보를 API에서 가져와서 전달
                    // 현재는 내 핀만 있으므로 기본값으로 MY 핀 사용
                    {
                      visibility: 'PRIVATE',
                      is_mine: true,
                    }
                  }
                />
              </View>
            )}

            {/* 구분선 - 확장 상태에서만 표시 */}
            {currentSheetIndex === 1 && <View style={styles.divider} />}

            {/* 기록카드 헤더 및 리스트 - 확장 상태에서만 표시 */}
            {currentSheetIndex === 1 && (
              <>
                {/* 기록카드 헤더 (Sticky) */}
                <View style={styles.stickyHeaderContainer}>
                  <View style={styles.recordsHeader}>
                    <View style={{flex: 1}}>
                      <CustomText style={styles.recordsTitle}>
                        이 장소에 등록된 기록카드
                      </CustomText>
                      <CustomText style={styles.recordsSubtitle}>
                        <Text style={{color: colorSystem.system.info}}>
                          {displayPlaceInfo?.place_name || '이 장소'}
                        </Text>
                        에 대해 이야기 해 주세요!
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
                      activeFilter={
                        selectedFilters &&
                        selectedFilters.length > 0 &&
                        !selectedFilters.includes('all')
                          ? 'mine'
                          : selectedFilters?.includes('all')
                          ? 'all'
                          : 'mine'
                      }
                      isExpanded={currentSheetIndex === 1}
                      onEditRecord={onEditRecord}
                      onDeleteRecord={onDeleteRecord}
                    />
                  )}
                </View>
              </>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </>
    );
  },
);

PlaceBottomSheet.displayName = 'PlaceBottomSheet';

export default PlaceBottomSheet;

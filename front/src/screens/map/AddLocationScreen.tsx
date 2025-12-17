import React, {useState, useRef, useMemo, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import CustomText from '@/components/common/CustomText';
import PreviewImageList from '@/components/common/PreviewImageList';
import ImageInput from '@/components/post/ImageInput';
import {colors, colorSystem} from '@/constants/colors';
import {layout} from '@/constants/layout';
import useThemeStore, {Theme} from '@/store/theme';
import {MapStackParamList} from '@/types/navigation';
import {getDateWithSeparator} from '@/utils/date';
import useImagePicker from '@/hooks/useImagePicker';
import {useCreatePin} from '@/hooks/usePin';

type Props = StackScreenProps<MapStackParamList, 'AddLocation'>;

const VISIBILITY_OPTIONS = [
  {
    id: 'PRIVATE',
    label: '나만 보기',
    pin: require('@/assets/pin/mini/miniMy.png'),
  },
  {
    id: 'FRIEND',
    label: '친구',
    pin: require('@/assets/pin/mini/miniFriend.png'),
  },
  {
    id: 'GROUP_10',
    label: '그룹1이름',
    pin: require('@/assets/pin/mini/miniGroup1.png'),
  },
  {
    id: 'GROUP_20',
    label: '그룹2이름',
    pin: require('@/assets/pin/mini/miniGroup2.png'),
  },
  {
    id: 'GROUP_30',
    label: '그룹3이름',
    pin: require('@/assets/pin/mini/miniGroup3.png'),
  },
  {
    id: 'GROUP_40',
    label: '그룹4이름',
    pin: require('@/assets/pin/mini/miniGroup4.png'),
  },
];

function AddLocationScreen({route}: Props) {
  const {placeInfo, location} = route.params;
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const [memo, setMemo] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState<string[]>([]);
  const [visitDate, setVisitDate] = useState<Date | null>(null);
  const [openDate, setOpenDate] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const imagePicker = useImagePicker({initialImages: []});
  const createPin = useCreatePin();

  // 바텀시트 관련
  const visibilityBottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  // 이미지 갤러리 관련
  const imageGalleryRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get('window').width;

  const handleOpenVisibilitySheet = useCallback(() => {
    visibilityBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleCloseVisibilitySheet = useCallback(() => {
    visibilityBottomSheetRef.current?.close();
  }, []);

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

  // 선택된 항목들을 VISIBILITY_OPTIONS 순서대로 정렬
  const getSortedSelectedVisibility = () => {
    return VISIBILITY_OPTIONS.filter(opt =>
      selectedVisibility.includes(opt.id),
    ).map(opt => opt.id);
  };

  const getVisibilityLabel = () => {
    if (selectedVisibility.length === 0) {
      return '공개 범위를 선택해 주세요';
    }
    const sortedIds = getSortedSelectedVisibility();
    if (sortedIds.length === 1) {
      return VISIBILITY_OPTIONS.find(opt => opt.id === sortedIds[0])?.label;
    }
    // 복수 선택 시 첫 번째 항목 외 N개 표시
    const firstLabel = VISIBILITY_OPTIONS.find(
      opt => opt.id === sortedIds[0],
    )?.label;
    return `${firstLabel} 외 ${sortedIds.length - 1}`;
  };

  const handleVisibilityToggle = (id: string) => {
    setSelectedVisibility(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = () => {
    if (!placeInfo || !visitDate || selectedVisibility.length === 0) return;
    const groupIds = selectedVisibility
      .filter(v => v.startsWith('GROUP_'))
      .map(v => parseInt(v.split('_')[1]));
    const visibilityArray: Array<'PRIVATE' | 'FRIEND' | 'GROUP'> = [];
    if (selectedVisibility.includes('PRIVATE')) {
      visibilityArray.push('PRIVATE');
    }
    if (selectedVisibility.includes('FRIEND')) {
      visibilityArray.push('FRIEND');
    }
    if (groupIds.length > 0) {
      visibilityArray.push('GROUP');
    }
    createPin.mutate(
      {
        place_id: placeInfo.place_id,
        visit_date: visitDate.toISOString(),
        memo: memo || undefined,
        photos:
          imagePicker.imageUris.length > 0
            ? imagePicker.imageUris.map(img => img.uri)
            : undefined,
        visibility: visibilityArray,
        group_ids: groupIds.length > 0 ? groupIds : undefined,
        color: colorSystem.primary.normal,
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      },
    );
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {paddingBottom: inset.bottom + 100},
        ]}>
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <CustomText style={styles.label}>기록 장소</CustomText>
            <CustomText style={styles.required}>*</CustomText>
          </View>
          <View style={[styles.placeCard, placeInfo && styles.placeCardActive]}>
            <View style={styles.placeIconContainer}>
              <Ionicons
                name="location"
                size={24}
                color={colorSystem.label.assistive}
              />
            </View>
            <View style={styles.placeInfo}>
              <CustomText style={styles.placeName} numberOfLines={1}>
                {placeInfo?.place_name || '장소 이름'}
              </CustomText>
              <CustomText style={styles.placeAddress} numberOfLines={1}>
                <Ionicons
                  name="location-outline"
                  size={12}
                  color={colorSystem.label.alternative}
                />{' '}
                {placeInfo?.address || '주소'}
              </CustomText>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <CustomText style={styles.label}>공개 범위</CustomText>
            <CustomText style={styles.required}>*</CustomText>
          </View>
          <Pressable
            style={[
              styles.selectButton,
              selectedVisibility.length > 0 && styles.selectButtonActive,
            ]}
            onPress={handleOpenVisibilitySheet}>
            <View style={styles.selectButtonContent}>
              {selectedVisibility.length > 0 ? (
                <Image
                  source={
                    VISIBILITY_OPTIONS.find(
                      opt => opt.id === getSortedSelectedVisibility()[0],
                    )?.pin
                  }
                  style={styles.pinIcon}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons
                  name="people"
                  size={20}
                  color={colorSystem.label.assistive}
                />
              )}
              <CustomText
                style={[
                  styles.selectButtonText,
                  selectedVisibility.length > 0 &&
                    styles.selectButtonTextActive,
                ]}>
                {getVisibilityLabel()}
              </CustomText>
            </View>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colorSystem.label.alternative}
            />
          </Pressable>
        </View>
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <CustomText style={styles.label}>방문 일자</CustomText>
            <CustomText style={styles.required}>*</CustomText>
          </View>
          <Pressable
            style={[styles.dateButton, visitDate && styles.dateButtonActive]}
            onPress={() => setOpenDate(true)}>
            <CustomText
              style={[
                styles.dateButtonText,
                !visitDate && styles.dateButtonTextPlaceholder,
              ]}>
              {visitDate
                ? getDateWithSeparator(visitDate, ' / ')
                : '방문 일자를 선택해 주세요'}
            </CustomText>
          </Pressable>
        </View>
        <View style={styles.section}>
          <CustomText style={styles.label}>기록</CustomText>
          <View
            style={[
              styles.memoContainer,
              (memo.length > 0 || imagePicker.imageUris.length > 0) &&
                styles.memoContainerActive,
            ]}>
            <TextInput
              style={styles.memoInput}
              placeholder="이 장소에 어떤 추억이 담겨있나요?"
              placeholderTextColor={colorSystem.label.assistive}
              multiline
              value={memo}
              onChangeText={setMemo}
              maxLength={100}
              textAlignVertical="top"
            />
            <CustomText style={styles.charCount}>{memo.length}/100</CustomText>
          </View>
          <View style={styles.imageSection}>
            <ImageInput
              onChange={imagePicker.handleChangeImage}
              disabled={imagePicker.imageUris.length >= 6}
            />
            <PreviewImageList
              imageUris={imagePicker.imageUris}
              onDelete={imagePicker.delete}
              showDeleteButton
              onPressImage={index => setSelectedImageIndex(index)}
            />
          </View>
        </View>
      </ScrollView>
      {/* 기록카드 저장하기 버튼 */}
      <View
        style={[
          styles.saveButtonContainer,
          {paddingBottom: inset.bottom || 12},
        ]}>
        <Pressable
          style={[
            styles.saveButton,
            (!visitDate || selectedVisibility.length === 0) &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!visitDate || selectedVisibility.length === 0}>
          <CustomText style={styles.saveButtonText}>
            ✓ 기록카드 저장하기
          </CustomText>
        </Pressable>
      </View>
      <DatePicker
        modal
        locale="ko"
        mode="date"
        title="방문일자 설정"
        cancelText="취소"
        confirmText="완료"
        date={visitDate || new Date()}
        open={openDate}
        onConfirm={date => {
          setVisitDate(date);
          setOpenDate(false);
        }}
        onCancel={() => setOpenDate(false)}
        minimumDate={new Date(2000, 0, 1)}
        maximumDate={new Date(2050, 11, 31)}
      />
      {/* 공개 범위 선택 바텀시트 */}
      <BottomSheet
        ref={visibilityBottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        style={{
          zIndex: 99999,
          elevation: 99999,
        }}
        backgroundStyle={{
          backgroundColor: colors[theme][0],
          borderTopLeftRadius: layout.ios.bottomsheet.rounding,
          borderTopRightRadius: layout.ios.bottomsheet.rounding,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors[theme].GRAY_300,
          width: 40,
        }}>
        <BottomSheetView style={styles.bottomSheetContainer}>
          {/* 헤더 */}
          <View style={styles.bottomSheetHeader}>
            <CustomText style={styles.bottomSheetTitle}>
              공개범위 선택
            </CustomText>
            <TouchableOpacity
              onPress={handleCloseVisibilitySheet}
              style={styles.doneButton}>
              <CustomText style={styles.doneButtonText}>완료</CustomText>
            </TouchableOpacity>
          </View>

          {/* 옵션 리스트 */}
          <View style={styles.optionList}>
            {VISIBILITY_OPTIONS.map(option => {
              const isSelected = selectedVisibility.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionItem}
                  onPress={() => handleVisibilityToggle(option.id)}>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors[theme].WHITE}
                      />
                    )}
                  </View>
                  <CustomText style={styles.optionLabel}>
                    {option.label}
                  </CustomText>
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheet>
      {/* 이미지 확대 모달 */}
      <Modal
        visible={selectedImageIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImageIndex(null)}>
        <View style={styles.imageModalOverlay}>
          <Pressable
            style={styles.imageModalCloseButton}
            onPress={() => setSelectedImageIndex(null)}>
            <Ionicons name="close" size={30} color={colors[theme][0]} />
          </Pressable>
          {selectedImageIndex !== null && (
            <>
              <FlatList
                ref={imageGalleryRef}
                data={imagePicker.imageUris}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={selectedImageIndex}
                getItemLayout={(data, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                onMomentumScrollEnd={event => {
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / screenWidth,
                  );
                  setSelectedImageIndex(newIndex);
                }}
                keyExtractor={(item, index) => `${item.uri}-${index}`}
                renderItem={({item}) => (
                  <View style={styles.imageModalSlide}>
                    <Image
                      source={{uri: item.uri}}
                      style={styles.imageModalImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />
              <View style={styles.imageModalIndicator}>
                <CustomText style={styles.imageModalIndicatorText}>
                  {(selectedImageIndex || 0) + 1} /{' '}
                  {imagePicker.imageUris.length}
                </CustomText>
              </View>
            </>
          )}
        </View>
      </Modal>
    </>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {gap: 24, padding: 20, backgroundColor: colors[theme][0]},
    section: {gap: 8},
    labelContainer: {flexDirection: 'row', alignItems: 'center', gap: 4},
    label: {fontSize: 16, fontWeight: '600', color: colorSystem.label.normal},
    required: {
      fontSize: 16,
      fontWeight: '600',
      color: colorSystem.system.error,
    },
    placeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      backgroundColor: colorSystem.background.gray,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colorSystem.label.disable,
    },
    placeCardActive: {
      borderColor: colorSystem.secondary.strong,
      borderWidth: 2,
    },
    placeIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: colors[theme].WHITE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeInfo: {flex: 1, gap: 4},
    placeName: {
      fontSize: 16,
      fontWeight: '600',
      color: colorSystem.label.strong,
    },
    placeAddress: {fontSize: 13, color: colorSystem.label.alternative},
    selectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colorSystem.background.gray,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colorSystem.label.disable,
      minHeight: 50,
    },
    selectButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    pinIcon: {
      width: 20,
      height: 20,
    },
    selectButtonText: {
      fontSize: 15,
      color: colorSystem.label.assistive,
      flex: 1,
    },
    selectButtonTextActive: {color: colorSystem.label.normal},
    selectButtonActive: {
      borderColor: colorSystem.secondary.strong,
      borderWidth: 2,
    },
    dateButton: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colorSystem.background.gray,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colorSystem.label.disable,
      minHeight: 50,
      justifyContent: 'center',
    },
    dateButtonActive: {
      borderColor: colorSystem.secondary.strong,
      borderWidth: 2,
    },
    dateButtonText: {fontSize: 15, color: colorSystem.label.normal},
    dateButtonTextPlaceholder: {color: colorSystem.label.assistive},
    memoContainer: {
      backgroundColor: colorSystem.background.gray,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colorSystem.label.disable,
      padding: 16,
      minHeight: 120,
    },
    memoContainerActive: {
      borderColor: colorSystem.secondary.strong,
      borderWidth: 2,
    },
    memoInput: {
      fontSize: 15,
      color: colorSystem.label.normal,
      flex: 1,
      minHeight: 80,
    },
    charCount: {
      fontSize: 12,
      color: colorSystem.label.alternative,
      textAlign: 'right',
      marginTop: 8,
    },
    imageSection: {flexDirection: 'row', marginTop: 12},
    // 바텀시트 스타일
    bottomSheetContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    bottomSheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colorSystem.label.disable,
      marginBottom: 8,
    },
    bottomSheetTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colorSystem.label.strong,
    },
    doneButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    doneButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colorSystem.primary.normal,
    },
    optionList: {
      paddingTop: 8,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 16,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colorSystem.label.assistive,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxSelected: {
      backgroundColor: colorSystem.primary.normal,
      borderColor: colorSystem.primary.normal,
    },
    optionLabel: {
      fontSize: 16,
      color: colorSystem.label.normal,
    },
    // 저장 버튼 스타일
    saveButtonContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      paddingTop: 12,
      paddingHorizontal: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors[theme].GRAY_300,
      backgroundColor: colors[theme][0],
    },
    saveButton: {
      width: '100%',
      height: 50,
      backgroundColor: colorSystem.primary.normal,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colorSystem.primary.normal,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: colorSystem.label.white,
      letterSpacing: 0.3,
    },
    saveButtonDisabled: {
      backgroundColor: colorSystem.label.disable,
      shadowOpacity: 0,
      elevation: 0,
    },
    // 이미지 모달 스타일
    imageModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    imageModalCloseButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 10,
      padding: 10,
    },
    imageModalSlide: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageModalImage: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    imageModalIndicator: {
      position: 'absolute',
      bottom: 50,
      alignSelf: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    imageModalIndicatorText: {
      color: colors[theme][0],
      fontSize: 14,
      fontWeight: '600',
    },
  });

export default AddLocationScreen;

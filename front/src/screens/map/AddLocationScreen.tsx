import {StackScreenProps} from '@react-navigation/stack';
import React, {useState, useMemo} from 'react';
import {ScrollView, StyleSheet, View, Pressable, TextInput} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import PlaceInfoCard from '@/components/post/PlaceInfoCard';
import PrivacyScopePicker from '@/components/post/PrivacyScopePicker';
import PreviewImageList from '@/components/common/PreviewImageList';
import ImageInput from '@/components/post/ImageInput';
import {colors, colorSystem} from '@/constants/colors';
import {useCreatePin} from '@/hooks/usePin';
import {calculatePinColor, ensurePrivateIncluded} from '@/utils/pinColor';
import useForm from '@/hooks/useForm';
import useImagePicker from '@/hooks/useImagePicker';
import usePermission from '@/hooks/usePermission';
import useThemeStore from '@/store/theme';
import {MapStackParamList} from '@/types/navigation';
import {PlaceInfo} from '@/types/api';
import CustomText from '@/components/common/CustomText';
import {useNavigation} from '@react-navigation/native';

type Props = StackScreenProps<MapStackParamList, 'AddLocation'>;

interface FormValues {
  privacyScope: string;
  date: Date;
  memo: string;
}

function AddLocationScreen({route}: Props) {
  const {theme} = useThemeStore();
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const {location, placeInfo} = (route.params || {}) as {
    location?: {latitude: number; longitude: number};
    placeInfo?: PlaceInfo;
  };

  const imagePicker = useImagePicker({initialImages: []});
  const createPin = useCreatePin();
  usePermission('PHOTO');

  const postForm = useForm<FormValues>({
    initialValue: {
      privacyScope: '',
      date: new Date(),
      memo: '',
    },
    validate: values => {
      const errors: Record<keyof FormValues, string> = {
        privacyScope: '',
        date: '',
        memo: '',
      };
      if (!values.privacyScope) {
        errors.privacyScope = '공개 범위를 선택해주세요.';
      }
      return errors;
    },
  });

  const [openDate, setOpenDate] = useState(false);

  // 공개 범위를 visibility 배열로 변환
  const visibility = useMemo((): Array<'PRIVATE' | 'FRIEND' | 'GROUP'> => {
    if (!postForm.values.privacyScope) return ['PRIVATE'];

    const scopeMap: Record<string, Array<'PRIVATE' | 'FRIEND' | 'GROUP'>> = {
      public: ['PRIVATE', 'FRIEND'],
      private: ['PRIVATE'],
      friends: ['PRIVATE', 'FRIEND'],
    };

    return ensurePrivateIncluded(
      scopeMap[postForm.values.privacyScope] || ['PRIVATE'],
    );
  }, [postForm.values.privacyScope]);

  // 핀 색상 자동 계산
  const pinColor = useMemo(() => {
    return calculatePinColor(visibility);
  }, [visibility]);

  const handleSubmit = () => {
    if (!placeInfo) {
      return;
    }

    const visitDate = postForm.values.date.toISOString().split('T')[0]; // YYYY-MM-DD 형식

    createPin.mutate(
      {
        place_id: placeInfo.place_id,
        visit_date: visitDate,
        memo: postForm.values.memo || undefined,
        photos: imagePicker.imageUris.map(img => img.uri),
        visibility,
        color: pinColor,
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: error => {
          console.error('핀 생성 실패:', error);
        },
      },
    );
  };

  const memoLength = postForm.values.memo.length;
  const maxLength = 100;

  // 날짜 포맷팅 (YYYY/MM/DD)
  const formattedDate = postForm.values.date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\. /g, '/')
    .replace('.', '');

  return (
    <>
      <View style={[styles.header, {paddingTop: inset.top}]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors[theme][100]} />
        </Pressable>
        <CustomText style={styles.headerTitle}>기록카드 등록하기</CustomText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          {paddingBottom: inset.bottom + 100},
        ]}>
        {/* 기록 장소 */}
        {placeInfo && (
          <View style={styles.section}>
            <CustomText style={styles.label}>
              기록 장소 <CustomText style={styles.required}>*</CustomText>
            </CustomText>
            <PlaceInfoCard placeInfo={placeInfo} />
          </View>
        )}

        {/* 공개 범위 */}
        <View style={styles.section}>
          <CustomText style={styles.label}>
            공개 범위 <CustomText style={styles.required}>*</CustomText>
          </CustomText>
          <PrivacyScopePicker
            value={postForm.values.privacyScope}
            onChange={value => postForm.onChange('privacyScope', value)}
            error={postForm.errors.privacyScope}
            touched={postForm.touched.privacyScope}
          />
        </View>

        {/* 방문 일자 */}
        <View style={styles.section}>
          <CustomText style={styles.label}>
            방문 일자 <CustomText style={styles.required}>*</CustomText>
          </CustomText>
          <Pressable
            style={styles.dateButton}
            onPress={() => setOpenDate(true)}>
            <CustomText style={styles.dateText}>
              {formattedDate || '2000/00/00'}
            </CustomText>
          </Pressable>
        </View>

        {/* 기록 */}
        <View style={styles.section}>
          <CustomText style={styles.label}>기록</CustomText>
          <View style={styles.memoContainer}>
            <TextInput
              style={styles.memoInput}
              placeholder="이 장소에 어떤 추억이 담겨있나요?"
              placeholderTextColor={colors[theme].GRAY_500}
              multiline
              value={postForm.values.memo}
              onChangeText={text => {
                if (text.length <= maxLength) {
                  postForm.onChange('memo', text);
                }
              }}
              maxLength={maxLength}
            />
            <View style={styles.counterContainer}>
              <CustomText style={styles.counter}>
                {memoLength}/{maxLength}
              </CustomText>
            </View>
          </View>
        </View>

        {/* 이미지 업로드 */}
        <View style={styles.section}>
          <View style={styles.imageRow}>
            <ImageInput onChange={imagePicker.handleChangeImage} />
            <PreviewImageList
              imageUris={imagePicker.imageUris}
              onDelete={imagePicker.delete}
              showDeleteButton
            />
          </View>
        </View>

        <DatePicker
          modal
          locale="ko"
          mode="date"
          title={null}
          cancelText="취소"
          confirmText="완료"
          date={postForm.values.date}
          open={openDate}
          onConfirm={date => {
            postForm.onChange('date', date);
            setOpenDate(false);
          }}
          onCancel={() => setOpenDate(false)}
        />
      </ScrollView>

      {/* 하단 저장 버튼 */}
      <View style={[styles.footer, {paddingBottom: inset.bottom || 12}]}>
        <Pressable
          style={[
            styles.saveButton,
            (!postForm.values.privacyScope || !placeInfo) &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!postForm.values.privacyScope || !placeInfo}>
          <Ionicons name="checkmark" size={20} color={colors[theme][0]} />
          <CustomText style={styles.saveButtonText}>
            기록카드 저장하기
          </CustomText>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.light.GRAY_200,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light[100],
  },
  headerRight: {
    width: 40,
  },
  container: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light[100],
  },
  required: {
    color: colors.light.RED_500,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.light.GRAY_200,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: colors.light.GRAY_100,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.light[100],
  },
  memoContainer: {
    borderWidth: 1,
    borderColor: colors.light.GRAY_200,
    borderRadius: 8,
    backgroundColor: colors.light.GRAY_100,
    minHeight: 120,
    padding: 16,
    position: 'relative',
  },
  memoInput: {
    fontSize: 14,
    color: colors.light[100],
    textAlignVertical: 'top',
    flex: 1,
    minHeight: 80,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  counter: {
    fontSize: 12,
    color: colors.light.GRAY_500,
  },
  imageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.light.GRAY_200,
    backgroundColor: colors.light[0],
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorSystem.primary.normal,
    borderRadius: 8,
    height: 50,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: colors.light.GRAY_300,
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light[0],
  },
});

export default AddLocationScreen;

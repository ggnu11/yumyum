import axiosInstance from './axios';
import {
  PlaceInfo,
  PinObject,
  CreatePinRequest,
  UpdatePinRequest,
  ApiResponse,
  RecordData,
} from '../types/api';

// 장소 정보 조회 API
export const getPlaceInfo = async (placeId: string): Promise<PlaceInfo> => {
  const {data} = await axiosInstance.get<ApiResponse<PlaceInfo>>(
    `/places/${placeId}`,
  );
  return data.data;
};

// 특정 장소의 핀 목록 조회 API (Array of Pin Objects)
export const getPlacePins = async (placeId: string): Promise<PinObject[]> => {
  const {data} = await axiosInstance.get<ApiResponse<PinObject[]>>(
    `/places/${placeId}/pins`,
  );
  return data.data;
};

// 핀 생성 API
export const createPin = async (
  pinData: CreatePinRequest,
): Promise<PinObject> => {
  const {data} = await axiosInstance.post<ApiResponse<PinObject>>(
    '/pins',
    pinData,
  );
  return data.data;
};

// 핀 수정 API
export const updatePin = async (
  pinId: number,
  pinData: UpdatePinRequest,
): Promise<PinObject> => {
  const {data} = await axiosInstance.put<ApiResponse<PinObject>>(
    `/pins/${pinId}`,
    pinData,
  );
  return data.data;
};

// 핀 삭제 API
export const deletePin = async (pinId: number): Promise<void> => {
  await axiosInstance.delete(`/pins/${pinId}`);
};

// 내 핀 목록 조회 API
export const getMyPins = async (): Promise<PinObject[]> => {
  const {data} = await axiosInstance.get<ApiResponse<PinObject[]>>('/pins/my');
  return data.data;
};

// API 데이터를 컴포넌트에서 사용할 형태로 변환하는 유틸 함수들
export const transformPinToRecord = (pin: PinObject): RecordData => {
  const memo = pin.memo || '';
  return {
    id: pin.pin_id,
    title: memo.slice(0, 50) + (memo.length > 50 ? '...' : ''), // 제목으로 사용할 짧은 텍스트
    content: memo,
    date: pin.visit_date,
    images: pin.photos,
    isOwner: pin.is_mine,
    author: {
      name: pin.user_name,
      profileImage: pin.user_profile_image_url,
    },
    visibility: pin.visibility,
    groupName: pin.group_name,
    originType: pin.origin_type,
    placeName: pin.place_name,
    updatedAt: pin.updated_at,
  };
};

export const transformPinsToRecords = (pins: PinObject[]): RecordData[] => {
  // updated_at 기준 최신순 정렬
  const sortedPins = [...pins].sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime();
    const dateB = new Date(b.updated_at).getTime();
    return dateB - dateA; // 최신순 (내림차순)
  });
  return sortedPins.map(transformPinToRecord);
};

// 사용자별 필터링 함수
export const filterRecordsByUser = (
  records: RecordData[],
  filterType: 'mine' | 'all',
): RecordData[] => {
  if (filterType === 'mine') {
    return records.filter(record => record.isOwner);
  }
  return records;
};

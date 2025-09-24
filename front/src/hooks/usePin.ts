import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  getPlaceInfo,
  getPlacePins,
  createPin,
  updatePin,
  deletePin,
  getMyPins,
  transformPinsToRecords,
  filterRecordsByUser,
} from '../api/pin';
import {
  PlaceInfo,
  PinObject,
  CreatePinRequest,
  UpdatePinRequest,
  RecordData,
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from '../types/api';

// Query Keys
export const pinQueryKeys = {
  all: ['pins'] as const,
  place: (placeId: string) => ['pins', 'place', placeId] as const,
  placeInfo: (placeId: string) => ['place', 'info', placeId] as const,
  myPins: () => ['pins', 'my'] as const,
};

// 장소 정보 조회 Hook
export const usePlaceInfo = (
  placeId: string,
  options?: UseQueryCustomOptions<PlaceInfo>,
) => {
  return useQuery({
    queryKey: pinQueryKeys.placeInfo(placeId),
    queryFn: () => getPlaceInfo(placeId),
    enabled: !!placeId,
    ...options,
  });
};

// 특정 장소의 핀 목록 조회 Hook
export const usePlacePins = (
  placeId: string,
  options?: UseQueryCustomOptions<PinObject[], RecordData[]>,
) => {
  return useQuery({
    queryKey: pinQueryKeys.place(placeId),
    queryFn: () => getPlacePins(placeId),
    select: data => transformPinsToRecords(data),
    enabled: !!placeId,
    ...options,
  });
};

// 내 핀 목록 조회 Hook
export const useMyPins = (
  options?: UseQueryCustomOptions<PinObject[], RecordData[]>,
) => {
  return useQuery({
    queryKey: pinQueryKeys.myPins(),
    queryFn: () => getMyPins(),
    select: data => transformPinsToRecords(data),
    ...options,
  });
};

// 핀 생성 Hook
export const useCreatePin = (
  options?: UseMutationCustomOptions<PinObject, CreatePinRequest>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPin,
    onSuccess: (data, variables) => {
      // 관련 쿼리들 무효화하여 리프레시
      queryClient.invalidateQueries({
        queryKey: pinQueryKeys.place(variables.place_id),
      });
      queryClient.invalidateQueries({
        queryKey: pinQueryKeys.myPins(),
      });
      // 장소 정보도 업데이트 (total_pin_count 변경)
      queryClient.invalidateQueries({
        queryKey: pinQueryKeys.placeInfo(variables.place_id),
      });
    },
    ...options,
  });
};

// 핀 수정 Hook
export const useUpdatePin = (
  options?: UseMutationCustomOptions<
    PinObject,
    {pinId: number; data: UpdatePinRequest}
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({pinId, data}) => updatePin(pinId, data),
    onSuccess: data => {
      // 관련 쿼리들 무효화하여 리프레시
      queryClient.invalidateQueries({
        queryKey: pinQueryKeys.all,
      });
    },
    ...options,
  });
};

// 핀 삭제 Hook
export const useDeletePin = (
  options?: UseMutationCustomOptions<void, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePin,
    onSuccess: () => {
      // 모든 핀 관련 쿼리들 무효화하여 리프레시
      queryClient.invalidateQueries({
        queryKey: pinQueryKeys.all,
      });
    },
    ...options,
  });
};

// 필터링된 레코드를 위한 커스텀 Hook
export const useFilteredRecords = (
  records: RecordData[] | undefined,
  filterType: 'mine' | 'all',
): RecordData[] => {
  if (!records) return [];
  return filterRecordsByUser(records, filterType);
};

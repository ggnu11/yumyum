import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import {AxiosError} from 'axios';

type ResponseError = AxiosError<{
  statusCode: number;
  message: string;
  error: string;
}>;

type UseMutationCustomOptions<TData = unknown, TVariables = unknown> = Omit<
  UseMutationOptions<TData, ResponseError, TVariables, unknown>,
  'mutationFn'
>;

type UseQueryCustomOptions<TQueryFnData = unknown, TData = TQueryFnData> = Omit<
  UseQueryOptions<TQueryFnData, ResponseError, TData, QueryKey>,
  'queryKey'
>;

export type {ResponseError, UseMutationCustomOptions, UseQueryCustomOptions};

// API 응답 타입 정의
export interface PlaceInfo {
  place_id: string;
  place_name: string;
  address: string;
  phone_number: string;
  total_pin_count: number;
  my_wish_exists?: boolean; // 현재 로그인된 사용자가 이 장소를 위시리스트에 담았는지 여부
  place_images?: string[]; // Google Places API에서 가져온 장소 이미지들
  types?: string[]; // Google Places API의 types 배열 (카테고리 정보)
}

export interface PinObject {
  pin_id: number;
  user_id: number;
  user_name: string;
  user_profile_image_url?: string;
  place_name: string;
  visit_date: string; // Date in ISO string format
  memo: string;
  photos: string[]; // Array of image URLs
  is_mine: boolean;
  visibility: Array<'PRIVATE' | 'FRIEND' | 'GROUP'>; // 배열로 변경
  group_name?: string; // visibility가 GROUP일 경우 그룹 이름
  origin_type?: 'FRIEND' | 'GROUP' | null; // 타인 핀일 경우 보게 된 경로, is_mine이 true면 null
  created_at: string; // Timestamp
  updated_at: string; // Timestamp (정렬 기준)
}

// API 요청 타입
export interface CreatePinRequest {
  place_id: string;
  visit_date: string;
  memo?: string; // Optional
  photos?: string[]; // Optional
  visibility: Array<'PRIVATE' | 'FRIEND' | 'GROUP'>; // 배열로 변경, PRIVATE 항상 포함
  group_ids?: number[]; // Optional, visibility에 GROUP이 포함될 경우 Required
  color: string; // 클라이언트가 자동 지정한 색상 코드
}

export interface UpdatePinRequest {
  visit_date?: string;
  memo?: string;
  photos?: string[];
  visibility?: Array<'PRIVATE' | 'FRIEND' | 'GROUP'>; // 배열로 변경
  group_ids?: number[]; // Optional, visibility에 GROUP이 포함될 경우 Required
  color?: string; // visibility 수정 시 재계산된 색상 코드
}

// API 응답을 위한 제네릭 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

// 컴포넌트에서 사용할 변환된 타입
export interface RecordData {
  id: number;
  title: string; // memo를 title로 사용
  content: string; // memo content
  date: string; // visit_date
  images?: string[]; // photos
  isOwner: boolean; // is_mine
  author?: {
    name: string; // user_name
    profileImage?: string; // user_profile_image_url
  };
  visibility: Array<'PRIVATE' | 'FRIEND' | 'GROUP'>; // 배열로 변경
  groupName?: string;
  originType?: 'FRIEND' | 'GROUP' | null; // 타인 핀일 경우 보게 된 경로
  placeName?: string; // place_name
  updatedAt?: string; // updated_at (정렬 기준)
}

// 지도 핀 API 응답 타입 (명세서 기반)
export interface PinDetails {
  id: number; // 대표 핀의 pin_id
  user_id: number;
  pin_count: number; // 클러스터링 시 사용할 총 핀 개수
  color: string; // 대표 핀의 색상 코드
  latest_activity_at: string; // Timestamp
  user_name: string;
  user_profile_image_url?: string;
  visibility: Array<'PRIVATE' | 'FRIEND' | 'GROUP'>; // 배열로 변경
  group_name?: string[]; // 그룹 이름 배열
}

export interface WishDetails {
  id: number; // 위시리스트 고유 ID
  created_at: string; // Timestamp
}

export interface YumyumInfo {
  pin_details: PinDetails | null;
  wish_details: WishDetails | null;
}

export interface SearchResultItem {
  place_id: string;
  place_name: string;
  address_name: string;
  latitude: number;
  longitude: number;
  distance: number | null; // 위치 권한이 없으면 null
  yumyum_info: YumyumInfo;
}

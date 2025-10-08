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
  place_images?: string[]; // Google Places API에서 가져온 장소 이미지들
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
  visibility: 'PRIVATE' | 'FRIEND' | 'GROUP';
  group_name?: string;
  created_at: string; // Timestamp
  updated_at: string; // Timestamp
}

// API 요청 타입
export interface CreatePinRequest {
  place_id: string;
  place_name: string;
  visit_date: string;
  memo: string;
  photos?: string[];
  visibility: 'PRIVATE' | 'FRIEND' | 'GROUP';
  group_name?: string;
}

export interface UpdatePinRequest {
  place_name?: string;
  visit_date?: string;
  memo?: string;
  photos?: string[];
  visibility?: 'PRIVATE' | 'FRIEND' | 'GROUP';
  group_name?: string;
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
  visibility: 'PRIVATE' | 'FRIEND' | 'GROUP';
  groupName?: string;
}

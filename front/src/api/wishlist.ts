import axiosInstance from './axios';
import {ApiResponse} from '../types/api';

interface CreateWishlistRequest {
  place_id: string;
}

export interface WishlistItem {
  wish_id: number;
  place_id: string;
  created_at: string;
}

// 위시리스트 추가 API
export const createWishlist = async (
  placeId: string,
): Promise<WishlistItem> => {
  const {data} = await axiosInstance.post<ApiResponse<WishlistItem>>(
    '/wishlists',
    {place_id: placeId} as CreateWishlistRequest,
  );
  return data.data;
};

// 특정 장소의 위시리스트 조회 API (wish_id를 얻기 위해)
export const getWishlistByPlaceId = async (
  placeId: string,
): Promise<WishlistItem | null> => {
  try {
    const {data} = await axiosInstance.get<ApiResponse<WishlistItem[]>>(
      '/wishlists',
      {params: {place_id: placeId}},
    );
    // 현재 사용자의 위시리스트만 반환 (첫 번째 항목)
    return data.data && data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    return null;
  }
};

// 위시리스트 삭제 API
export const deleteWishlist = async (wishId: number): Promise<void> => {
  await axiosInstance.delete(`/wishlists/${wishId}`);
};

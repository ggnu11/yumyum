import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {WishlistItem} from '@/api/wishlist';
import {UseMutationCustomOptions, UseQueryCustomOptions} from '@/types/api';
import {pinQueryKeys} from '../usePin';

// 위시리스트 조회 Hook
export const useWishlistByPlaceId = (
  placeId: string,
  options?: UseQueryCustomOptions<WishlistItem | null>,
) => {
  return useQuery({
    queryKey: ['wishlist', 'place', placeId],
    queryFn: async () => {
      // 더미 데이터 반환 (API 작업 전까지)
      await new Promise(resolve => setTimeout(resolve, 200)); // 로딩 시뮬레이션
      const {getMockWishlist} = await import('@/utils/mockData');
      return getMockWishlist(placeId);
    },
    enabled: !!placeId,
    ...options,
  });
};

// 위시리스트 추가 Hook
export const useCreateWishlist = (
  options?: UseMutationCustomOptions<WishlistItem, string>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (placeId: string) => {
      // 더미 데이터 반환 (API 작업 전까지)
      await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
      return {
        wish_id: Date.now(),
        place_id: placeId,
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: (data, placeId) => {
      // 장소 정보 쿼리 무효화 (my_wish_exists 업데이트)
      queryClient.invalidateQueries({
        queryKey: pinQueryKeys.placeInfo(placeId),
      });
      // 위시리스트 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['wishlist', 'place', placeId],
      });
      // 위시리스트 데이터 설정
      queryClient.setQueryData(['wishlist', 'place', placeId], data);
    },
    ...options,
  });
};

// 위시리스트 삭제 Hook
export const useDeleteWishlist = (
  options?: UseMutationCustomOptions<void, {wishId: number; placeId: string}>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({wishId}) => {
      // 더미 데이터 반환 (API 작업 전까지)
      await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
      return;
    },
    onSuccess: (data, variables) => {
      // 장소 정보 쿼리 무효화 (my_wish_exists 업데이트)
      queryClient.invalidateQueries({
        queryKey: pinQueryKeys.placeInfo(variables.placeId),
      });
      // 위시리스트 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['wishlist', 'place', variables.placeId],
      });
      // 위시리스트 데이터 제거
      queryClient.setQueryData(['wishlist', 'place', variables.placeId], null);
    },
    ...options,
  });
};

import {queryKeys} from '@/constants/keys';
import {UseQueryCustomOptions, SearchResultItem} from '@/types/api';
import {useQuery} from '@tanstack/react-query';
import {Region} from 'react-native-maps';
import {getMockMapPins} from '@/utils/mockData';

interface UseGetMapPinsParams {
  region: Region | null;
  filters?: string[];
  enabled?: boolean;
}

function useGetMapPins(
  params: UseGetMapPinsParams,
  queryOptions?: UseQueryCustomOptions<SearchResultItem[]>,
) {
  return useQuery({
    queryFn: async () => {
      if (!params.region) {
        return [];
      }

      // 더미 데이터 반환 (API 작업 전까지)
      await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
      return getMockMapPins();
    },
    queryKey: [
      queryKeys.MARKER,
      'map-pins',
      params.region?.latitude,
      params.region?.longitude,
      params.region?.latitudeDelta,
      params.region?.longitudeDelta,
      params.filters,
    ],
    enabled: params.enabled !== false && params.region !== null,
    ...queryOptions,
  });
}

export default useGetMapPins;

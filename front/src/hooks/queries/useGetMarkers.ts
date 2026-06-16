import {getMarkers} from '@/api/marker';
import {queryKeys} from '@/constants/keys';
import {numbers} from '@/constants/numbers';
import {UseQueryCustomOptions} from '@/types/api';
import {Marker} from '@/types/domain';
import {useQuery} from '@tanstack/react-query';

function useGetMarkers(queryOptions?: UseQueryCustomOptions<Marker[]>) {
  return useQuery({
    queryFn: getMarkers,
    queryKey: [queryKeys.MARKER, queryKeys.GET_MARKERS],
    staleTime: numbers.DEFAULT_STALE_TIME,
    ...queryOptions,
  });
}

export default useGetMarkers;

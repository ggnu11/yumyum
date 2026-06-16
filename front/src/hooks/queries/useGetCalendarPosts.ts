import {keepPreviousData, useQuery} from '@tanstack/react-query';

import {getCalendarPosts, ResponseCalendarPost} from '@/api/post';
import {queryKeys} from '@/constants/keys';
import {numbers} from '@/constants/numbers';
import {UseQueryCustomOptions} from '@/types/api';

function useGetCalendarPosts(
  year: number,
  month: number,
  queryOptions?: UseQueryCustomOptions<ResponseCalendarPost>,
) {
  return useQuery({
    queryFn: () => getCalendarPosts(year, month),
    queryKey: [
      queryKeys.POST,
      queryKeys.GET_POSTS,
      queryKeys.GET_CALENDAR_POSTS,
      year,
      month,
    ],
    staleTime: numbers.DEFAULT_STALE_TIME,
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
}

export default useGetCalendarPosts;

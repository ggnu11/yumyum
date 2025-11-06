import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import Config from 'react-native-config';
import {LatLng} from 'react-native-maps';

type Meta = {
  total_count: number;
  pageable_count: number;
  is_end: boolean;
  same_name: {
    region: string[];
    keyword: string;
    selected_region: string;
  };
};

export type RegionInfo = {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
};

type RegionResponse = {
  meta: Meta;
  documents: RegionInfo[];
};

interface CacheEntry {
  data: RegionInfo[];
  hasNextPage: boolean;
  timestamp: number;
}

// 캐시 저장소 (모듈 레벨에서 공유)
const searchCache = new Map<string, CacheEntry>();
const CACHE_EXPIRY_TIME = 30 * 60 * 1000; // 30분
const MAX_CACHE_SIZE = 50; // 최대 캐시 항목 수

// 캐시 키 생성
const getCacheKey = (keyword: string, location: LatLng): string => {
  const roundedLat = Math.round(location.latitude * 100) / 100; // 소수점 2자리로 반올림
  const roundedLng = Math.round(location.longitude * 100) / 100;
  return `${keyword.toLowerCase().trim()}_${roundedLat}_${roundedLng}`;
};

// 캐시 정리 (오래된 항목 제거)
const cleanCache = () => {
  const now = Date.now();
  const entries = Array.from(searchCache.entries());
  
  // 만료된 항목 제거
  entries.forEach(([key, entry]) => {
    if (now - entry.timestamp > CACHE_EXPIRY_TIME) {
      searchCache.delete(key);
    }
  });

  // 캐시 크기가 너무 크면 오래된 항목부터 제거
  if (searchCache.size > MAX_CACHE_SIZE) {
    const sortedEntries = Array.from(searchCache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp,
    );
    const toDelete = sortedEntries.slice(0, searchCache.size - MAX_CACHE_SIZE);
    toDelete.forEach(([key]) => searchCache.delete(key));
  }
};

function useSearchLocation(keyword: string, location: LatLng) {
  const [regionInfo, setRegionInfo] = useState<RegionInfo[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [pageParam, setPageParam] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchNextPage = () => {
    setPageParam(prev => prev + 1);
  };

  const fetchPrevPage = () => {
    setPageParam(prev => prev - 1);
  };

  useEffect(() => {
    // keyword가 비어있으면 검색하지 않음
    if (!keyword || keyword.trim() === '') {
      setRegionInfo([]);
      setHasNextPage(false);
      setPageParam(1);
      return;
    }

    // location이 없으면 검색하지 않음
    if (!location || !location.latitude || !location.longitude) {
      setRegionInfo([]);
      setHasNextPage(false);
      return;
    }

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // pageParam이 1일 때만 캐시 확인 (첫 페이지만 캐싱)
    if (pageParam === 1) {
      const cacheKey = getCacheKey(keyword.trim(), location);
      const cached = searchCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY_TIME) {
        // 캐시에서 결과 사용
        setRegionInfo(cached.data);
        setHasNextPage(cached.hasNextPage);
        return;
      }
    }

    // 캐시 정리
    cleanCache();

    // 새로운 요청 생성
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    (async () => {
      try {
        const {data} = await axios.get<RegionResponse>(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword.trim())}&y=${location.latitude}&x=${location.longitude}&page=${pageParam}`,
          {
            headers: {
              Authorization: `KakaoAK ${Config.KAKAO_REST_API_KEY}`,
            },
            signal: abortController.signal,
          },
        );

        // 요청이 취소되지 않았을 때만 상태 업데이트
        if (!abortController.signal.aborted) {
          setHasNextPage(!data.meta.is_end);
          setRegionInfo(data.documents);

          // 첫 페이지 결과만 캐시에 저장
          if (pageParam === 1) {
            const cacheKey = getCacheKey(keyword.trim(), location);
            searchCache.set(cacheKey, {
              data: data.documents,
              hasNextPage: !data.meta.is_end,
              timestamp: Date.now(),
            });
          }
        }
      } catch (error: any) {
        // 요청 취소는 정상적인 경우이므로 무시
        if (error.name === 'AbortError' || error.name === 'CanceledError') {
          return;
        }
        
        if (!abortController.signal.aborted) {
          console.error('검색 API 호출 실패:', error);
          setRegionInfo([]);
          setHasNextPage(false);
        }
      }
    })();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [keyword, location, pageParam]);

  return {regionInfo, pageParam, fetchNextPage, fetchPrevPage, hasNextPage};
}

export default useSearchLocation;

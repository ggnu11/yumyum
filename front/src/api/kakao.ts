import axios from 'axios';
import Config from 'react-native-config';
import {LatLng} from 'react-native-maps';

// 구글 Places API 응답 타입 정의
export interface GooglePlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions: string[];
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  photos?: GooglePlacePhoto[];
}

export interface GooglePlaceDetailsResponse {
  result: GooglePlaceDetails;
  status: string;
}

// Google Places Photo URL 생성 함수
export const getGooglePlacePhotoUrl = (
  photoReference: string,
  maxWidth: number = 400,
): string => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${Config.GOOGLE_MAP_API_KEY}`;
};

// 카카오 API 응답 타입 정의
export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // longitude
  y: string; // latitude
  place_url: string;
  distance: string;
}

export interface KakaoPlaceResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
    same_name?: {
      region: string[];
      keyword: string;
      selected_region: string;
    };
  };
  documents: KakaoPlace[];
}

// 구글 Places API로 장소 상세 정보 가져오기
export const getGooglePlaceDetails = async (
  placeId: string,
): Promise<GooglePlaceDetails | null> => {
  try {
    const response = await axios.get<GooglePlaceDetailsResponse>(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields:
            'place_id,name,formatted_address,formatted_phone_number,international_phone_number,geometry,types,rating,user_ratings_total,photos',
          key: Config.GOOGLE_MAP_API_KEY,
          language: 'ko', // 한국어로 결과 받기
        },
      },
    );

    if (response.data.status === 'OK') {
      return response.data.result;
    }

    console.error('구글 Places API 오류:', response.data.status);
    return null;
  } catch (error) {
    console.error('구글 Places API 호출 실패:', error);
    return null;
  }
};

// 구글과 카카오 API 정보를 조합하여 최적의 장소 정보 생성
export const getCombinedPlaceInfo = async (
  googlePlaceId: string,
  coordinate: LatLng,
  googlePlaceName?: string,
): Promise<any> => {
  try {
    // 1. 구글 Places API로 상세 정보 가져오기
    const googlePlace = await getGooglePlaceDetails(googlePlaceId);

    // 2. 카카오 API로 주변 장소 검색 (보완 정보용)
    const kakaoPlace = await searchPlaceByCoordinate(coordinate);

    // 3. 두 API 정보 조합
    if (googlePlace) {
      // 구글 정보를 기본으로 하고 카카오 정보로 보완
      const placeImages = googlePlace.photos
        ? googlePlace.photos
            .slice(0, 10)
            .map(photo => getGooglePlacePhotoUrl(photo.photo_reference, 400))
        : [];

      return {
        place_id: googlePlace.place_id,
        place_name: googlePlace.name,
        address: googlePlace.formatted_address,
        phone_number:
          googlePlace.formatted_phone_number ||
          googlePlace.international_phone_number ||
          kakaoPlace?.phone ||
          '',
        total_pin_count: 0, // 백엔드에서 계산
        rating: googlePlace.rating,
        user_ratings_total: googlePlace.user_ratings_total,
        types: googlePlace.types,
        place_images: placeImages,
        coordinate: {
          latitude: googlePlace.geometry.location.lat,
          longitude: googlePlace.geometry.location.lng,
        },
      };
    } else if (kakaoPlace) {
      // 구글 정보가 없으면 카카오 정보 사용
      return transformKakaoPlaceToPlaceInfo(kakaoPlace, 0);
    } else {
      // 둘 다 없으면 기본 정보 반환
      return {
        place_id: googlePlaceId,
        place_name: googlePlaceName || '알 수 없는 장소',
        address: '주소 정보 없음',
        phone_number: '',
        total_pin_count: 0,
        place_images: [],
      };
    }
  } catch (error) {
    console.error('장소 정보 조합 실패:', error);
    return {
      place_id: googlePlaceId,
      place_name: googlePlaceName || '알 수 없는 장소',
      address: '주소 정보 없음',
      phone_number: '',
      total_pin_count: 0,
      place_images: [],
    };
  }
};

export const searchPlaceByCoordinate = async (
  coordinate: LatLng,
): Promise<KakaoPlace | null> => {
  try {
    const {latitude, longitude} = coordinate;

    // 1차: 음식점 카테고리로 먼저 검색
    const foodResponse = await axios.get<KakaoPlaceResponse>(
      'https://dapi.kakao.com/v2/local/search/category.json',
      {
        params: {
          category_group_code: 'FD6', // 음식점 카테고리
          x: longitude,
          y: latitude,
          radius: 50, // 50m 반경으로 확장
          sort: 'distance', // 거리순 정렬
          size: 1, // 가장 가까운 1개만
        },
        headers: {
          Authorization: `KakaoAK ${Config.KAKAO_REST_API_KEY}`,
        },
      },
    );

    if (foodResponse.data.documents.length > 0) {
      return foodResponse.data.documents[0];
    }

    // 2차: 다른 주요 카테고리들도 검색
    const categories = [
      'MT1',
      'CS2',
      'PS3',
      'SC4',
      'AC5',
      'PK6',
      'OL7',
      'SW8',
      'BK9',
      'CT1',
      'AG2',
      'PO3',
      'AT4',
      'AD5',
      'FD6',
      'CE7',
      'HP8',
      'PM9',
    ];

    for (const category of categories) {
      const response = await axios.get<KakaoPlaceResponse>(
        'https://dapi.kakao.com/v2/local/search/category.json',
        {
          params: {
            category_group_code: category,
            x: longitude,
            y: latitude,
            radius: 100, // 100m 반경으로 확장
            sort: 'distance',
            size: 1,
          },
          headers: {
            Authorization: `KakaoAK ${Config.KAKAO_REST_API_KEY}`,
          },
        },
      );

      if (response.data.documents.length > 0) {
        return response.data.documents[0];
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

// 카카오 장소 데이터를 앱의 PlaceInfo 타입으로 변환
export const transformKakaoPlaceToPlaceInfo = (
  kakaoPlace: KakaoPlace,
  pinCount: number = 0,
) => {
  return {
    place_id: kakaoPlace.id,
    place_name: kakaoPlace.place_name,
    address: kakaoPlace.road_address_name || kakaoPlace.address_name,
    phone_number: kakaoPlace.phone || '',
    total_pin_count: pinCount,
    place_images: [],
  };
};

// 키워드로 장소 검색 (기존 useSearchLocation에서 사용)
export const searchPlaceByKeyword = async (
  keyword: string,
  location: LatLng,
  page: number = 1,
): Promise<KakaoPlaceResponse> => {
  const response = await axios.get<KakaoPlaceResponse>(
    'https://dapi.kakao.com/v2/local/search/keyword.json',
    {
      params: {
        query: keyword,
        x: location.longitude,
        y: location.latitude,
        page,
        size: 15,
        sort: 'distance',
      },
      headers: {
        Authorization: `KakaoAK ${Config.KAKAO_REST_API_KEY}`,
      },
    },
  );

  return response.data;
};

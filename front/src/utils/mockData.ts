import {SearchResultItem, PlaceInfo, PinObject, WishlistItem, PinDetails, WishDetails} from '@/types/api';
import {colorSystem} from '@/constants/colors';

// 더미 지도 핀 데이터
export const getMockMapPins = (): SearchResultItem[] => {
  return [
    {
      place_id: '1234567890',
      place_name: '엄마손칼국수',
      address_name: '대전 서구 문정로 64',
      latitude: 36.3504,
      longitude: 127.3845,
      distance: 500,
      yumyum_info: {
        pin_details: {
          id: 1,
          user_id: 1,
          pin_count: 2,
          color: colorSystem.pin.blue,
          latest_activity_at: new Date().toISOString(),
          user_name: '사용자1',
          user_profile_image_url: 'https://picsum.photos/100/100?random=1',
          visibility: ['PRIVATE', 'FRIEND'],
          group_name: undefined,
        },
        wish_details: null,
      },
    },
    {
      place_id: '0987654321',
      place_name: '맛있는 식당',
      address_name: '대전 유성구 대학로 123',
      latitude: 36.3514,
      longitude: 127.3855,
      distance: 800,
      yumyum_info: {
        pin_details: {
          id: 2,
          user_id: 1,
          pin_count: 1,
          color: colorSystem.pin.red,
          latest_activity_at: new Date(Date.now() - 86400000).toISOString(),
          user_name: '사용자1',
          user_profile_image_url: undefined,
          visibility: ['PRIVATE'],
          group_name: undefined,
        },
        wish_details: {
          id: 1,
          created_at: new Date().toISOString(),
        },
      },
    },
    {
      place_id: '1122334455',
      place_name: '좋은 카페',
      address_name: '대전 중구 중앙로 456',
      latitude: 36.3524,
      longitude: 127.3865,
      distance: 1200,
      yumyum_info: {
        pin_details: null,
        wish_details: {
          id: 2,
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      },
    },
  ];
};

// 더미 장소 정보
export const getMockPlaceInfo = (placeId: string): PlaceInfo => {
  return {
    place_id: placeId,
    place_name: '엄마손칼국수',
    address: '대전 서구 문정로 64',
    phone_number: '042-489-4900',
    total_pin_count: 2,
    my_wish_exists: false,
    types: ['restaurant', 'food', 'meal_takeaway'],
  };
};

// 더미 핀 목록
export const getMockPlacePins = (placeId: string): PinObject[] => {
  return [
    {
      pin_id: 1,
      user_id: 1,
      user_name: '사용자1',
      user_profile_image_url: 'https://picsum.photos/100/100?random=1',
      place_name: '엄마손칼국수',
      visit_date: '2025-11-20',
      memo: '민주랑 함께 간단하게 점심 먹으러 갔는데 생각보다 너무 마음에 들었던 집! 겨울마다 와야지~',
      photos: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
      ],
      is_mine: true,
      visibility: ['PRIVATE', 'FRIEND'],
      group_name: undefined,
      origin_type: null,
      created_at: new Date('2025-11-20').toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      pin_id: 2,
      user_id: 2,
      user_name: '다정한코알라175',
      user_profile_image_url: 'https://picsum.photos/100/100?random=10',
      place_name: '엄마손칼국수',
      visit_date: '2025-11-15',
      memo: '원래 데이스 코스로 알아둔 가게들이 모두 영업을 안 해서 급하게 유겨찾던 곳. 의외로 맛집이라 오히려 좋았다!',
      photos: [
        'https://picsum.photos/400/300?random=4',
        'https://picsum.photos/400/300?random=5',
      ],
      is_mine: false,
      visibility: ['PRIVATE', 'FRIEND'],
      group_name: undefined,
      origin_type: 'FRIEND',
      created_at: new Date('2025-11-15').toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      pin_id: 3,
      user_id: 1,
      user_name: '사용자1',
      user_profile_image_url: undefined,
      place_name: '엄마손칼국수',
      visit_date: '2025-11-10',
      memo: '첫 방문 기록',
      photos: [],
      is_mine: true,
      visibility: ['PRIVATE'],
      group_name: undefined,
      origin_type: null,
      created_at: new Date('2025-11-10').toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
};

// 더미 위시리스트
export const getMockWishlist = (placeId: string): WishlistItem | null => {
  // 랜덤하게 위시리스트가 있는 경우와 없는 경우 반환
  if (placeId === '1234567890') {
    return {
      wish_id: 1,
      place_id: placeId,
      created_at: new Date().toISOString(),
    };
  }
  return null;
};


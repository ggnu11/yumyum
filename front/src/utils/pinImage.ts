import {ImageSourcePropType} from 'react-native';

/**
 * 핀 타입 정의
 */
export type PinType = 'MY' | 'FRIEND' | 'GROUP1' | 'GROUP2' | 'GROUP3' | 'GROUP4' | 'GROUP5' | 'WISH';

/**
 * 핀 이미지 크기
 */
export type PinSize = 'small' | 'mini' | 'large';

/**
 * 핀 타입 결정 파라미터
 */
export interface PinTypeParams {
  visibility: 'PRIVATE' | 'FRIEND' | 'GROUP';
  is_mine?: boolean;
  group_id?: number;
  is_wish?: boolean;
}

/**
 * 핀의 타입을 결정하는 함수
 * 우선순위: WISH > FRIEND > GROUP > MY
 */
export function getPinType(params: PinTypeParams): PinType {
  const {visibility, is_mine, group_id, is_wish} = params;

  // Wish 핀 (즐겨찾기)
  if (is_wish) {
    return 'WISH';
  }

  // Friend 핀
  if (visibility === 'FRIEND') {
    return 'FRIEND';
  }

  // Group 핀
  if (visibility === 'GROUP' && group_id) {
    // group_id에 따라 GROUP1~5 결정
    // group_id는 1부터 시작한다고 가정
    const groupNumber = ((group_id - 1) % 5) + 1;
    return (`GROUP${groupNumber}` as PinType);
  }

  // My 핀 (기본값)
  return 'MY';
}

/**
 * 핀 이미지를 가져오는 함수
 */
export function getPinImage(type: PinType, size: PinSize): ImageSourcePropType {
  const imageMap: Record<PinType, Record<PinSize, ImageSourcePropType>> = {
    MY: {
      small: require('@/assets/pin/small/smallMy.png'),
      mini: require('@/assets/pin/mini/miniMy.png'),
      large: require('@/assets/pin/large/largeMy.png'),
    },
    FRIEND: {
      small: require('@/assets/pin/small/smallFriend.png'),
      mini: require('@/assets/pin/mini/miniFriend.png'),
      large: require('@/assets/pin/large/largeFriend.png'),
    },
    GROUP1: {
      small: require('@/assets/pin/small/smallGroup1.png'),
      mini: require('@/assets/pin/mini/miniGroup1.png'),
      large: require('@/assets/pin/large/largeGroup1.png'),
    },
    GROUP2: {
      small: require('@/assets/pin/small/smallGroup2.png'),
      mini: require('@/assets/pin/mini/miniGroup2.png'),
      large: require('@/assets/pin/large/largeGroup2.png'),
    },
    GROUP3: {
      small: require('@/assets/pin/small/smallGroup3.png'),
      mini: require('@/assets/pin/mini/miniGroup3.png'),
      large: require('@/assets/pin/large/largeGroup3.png'),
    },
    GROUP4: {
      small: require('@/assets/pin/small/smallGroup4.png'),
      mini: require('@/assets/pin/mini/miniGroup4.png'),
      large: require('@/assets/pin/large/largeGroup4.png'),
    },
    GROUP5: {
      small: require('@/assets/pin/small/smallGroup5.png'),
      mini: require('@/assets/pin/mini/miniGroup5.png'),
      large: require('@/assets/pin/large/largeGroup5.png'),
    },
    WISH: {
      small: require('@/assets/pin/small/smallWish.png'),
      mini: require('@/assets/pin/mini/miniWish.png'),
      large: require('@/assets/pin/large/largeWish.png'),
    },
  };

  return imageMap[type][size];
}

/**
 * 핀 타입 파라미터로부터 직접 이미지를 가져오는 헬퍼 함수
 */
export function getPinImageFromParams(
  params: PinTypeParams,
  size: PinSize,
): ImageSourcePropType {
  const pinType = getPinType(params);
  return getPinImage(pinType, size);
}


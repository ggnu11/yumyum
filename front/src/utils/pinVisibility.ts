import {PinDetails} from '@/types/api';
import {PinTypeParams} from '@/utils/pinImage';

/**
 * visibility 배열에서 색상을 결정하는 함수
 * 명세서: FRIEND가 있으면 FRIEND, 없고 GROUP이 있으면 GROUP, 둘 다 없으면 PRIVATE
 */
export function getVisibilityFromArray(
  visibility: Array<'PRIVATE' | 'FRIEND' | 'GROUP'>,
): 'PRIVATE' | 'FRIEND' | 'GROUP' {
  if (visibility.includes('FRIEND')) {
    return 'FRIEND';
  }
  if (visibility.includes('GROUP')) {
    return 'GROUP';
  }
  return 'PRIVATE';
}

/**
 * PinDetails를 PinTypeParams로 변환
 */
export function convertPinDetailsToParams(
  pinDetails: PinDetails,
  isMine: boolean,
): PinTypeParams {
  const visibility = getVisibilityFromArray(pinDetails.visibility);
  
  // GROUP인 경우 group_name 배열에서 첫 번째 그룹의 ID를 추출
  // 실제로는 group_id가 필요하지만, 현재는 group_name만 있으므로 임시로 처리
  let groupId: number | undefined;
  if (visibility === 'GROUP' && pinDetails.group_name && pinDetails.group_name.length > 0) {
    // group_name에서 ID를 추출하거나, 이름 기반으로 해시값 생성
    // 실제 구현에서는 group_id를 API에서 받아야 함
    groupId = 1; // 임시값
  }

  return {
    visibility,
    is_mine: isMine,
    group_id: groupId,
    is_wish: false, // 핀은 위시가 아님
  };
}


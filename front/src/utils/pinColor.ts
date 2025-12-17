import {colorSystem} from '@/constants/colors';

/**
 * 핀 색상 자동 지정 함수
 * 명세서: 선택된 공개 범위의 우선순위 규칙(친구 > 최신 그룹 > 나)에 따라 핀의 색상을 결정
 * 
 * @param visibility 공개 범위 배열 (PRIVATE은 항상 포함)
 * @param groupIds 그룹 ID 배열 (visibility에 GROUP이 포함될 경우 필수)
 * @returns Hex 색상 코드
 */
export function calculatePinColor(
  visibility: Array<'PRIVATE' | 'FRIEND' | 'GROUP'>,
  groupIds?: number[],
): string {
  // FRIEND가 있으면 FRIEND 색상 (BLUE)
  if (visibility.includes('FRIEND')) {
    return colorSystem.pin.blue;
  }

  // FRIEND가 없고 GROUP이 있으면 GROUP 색상
  if (visibility.includes('GROUP') && groupIds && groupIds.length > 0) {
    // 최신 그룹의 색상 사용 (첫 번째 그룹 ID 기준)
    // group_id에 따라 색상 결정 (1: red, 2: yellow, 3: yellowGreen, 4: teal, 5: blue)
    const groupId = groupIds[0]; // 최신 그룹 (첫 번째)
    const groupNumber = ((groupId - 1) % 5) + 1;

    switch (groupNumber) {
      case 1:
        return colorSystem.pin.red;
      case 2:
        return colorSystem.pin.yellow;
      case 3:
        return colorSystem.pin.yellowGreen;
      case 4:
        return colorSystem.pin.teal;
      case 5:
        return colorSystem.pin.blue;
      default:
        return colorSystem.pin.red;
    }
  }

  // PRIVATE만 있는 경우 (기본 색상)
  return colorSystem.pin.gray;
}

/**
 * visibility 배열에 PRIVATE이 항상 포함되도록 보장
 */
export function ensurePrivateIncluded(
  visibility: Array<'PRIVATE' | 'FRIEND' | 'GROUP'>,
): Array<'PRIVATE' | 'FRIEND' | 'GROUP'> {
  if (!visibility.includes('PRIVATE')) {
    return ['PRIVATE', ...visibility];
  }
  return visibility;
}


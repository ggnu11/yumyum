// Google Places API의 types를 한국어 카테고리로 변환하는 매핑
const PLACE_TYPE_MAPPING: Record<string, string> = {
  restaurant: '음식점',
  food: '음식점',
  meal_takeaway: '테이크아웃',
  meal_delivery: '배달',
  cafe: '카페',
  bakery: '베이커리',
  bar: '바',
  night_club: '클럽',
  lodging: '숙박',
  tourist_attraction: '관광명소',
  amusement_park: '놀이공원',
  aquarium: '수족관',
  art_gallery: '미술관',
  museum: '박물관',
  zoo: '동물원',
  shopping_mall: '쇼핑몰',
  store: '매장',
  supermarket: '마트',
  convenience_store: '편의점',
  gas_station: '주유소',
  hospital: '병원',
  pharmacy: '약국',
  bank: '은행',
  atm: 'ATM',
  gym: '헬스장',
  spa: '스파',
  beauty_salon: '미용실',
  hair_care: '미용실',
  school: '학교',
  university: '대학교',
  library: '도서관',
  church: '교회',
  mosque: '모스크',
  synagogue: '시나고그',
  hindu_temple: '힌두교 사원',
  park: '공원',
  stadium: '경기장',
  movie_theater: '영화관',
  bowling_alley: '볼링장',
  casino: '카지노',
  dentist: '치과',
  veterinary_care: '동물병원',
  car_dealer: '자동차 딜러',
  car_rental: '렌터카',
  car_repair: '자동차 수리점',
  car_wash: '세차장',
  taxi_stand: '택시 승강장',
  bus_station: '버스정류장',
  subway_station: '지하철역',
  train_station: '기차역',
  airport: '공항',
  travel_agency: '여행사',
  real_estate_agency: '부동산',
  insurance_agency: '보험사',
  lawyer: '법무사',
  accounting: '회계사',
  electrician: '전기기사',
  plumber: '배관공',
  locksmith: '열쇠수리',
  roofing_contractor: '지붕수리',
  moving_company: '이사업체',
  storage: '창고',
  laundry: '세탁소',
  clothing_store: '의류매장',
  shoe_store: '신발매장',
  jewelry_store: '보석상',
  electronics_store: '전자제품매장',
  furniture_store: '가구점',
  home_goods_store: '생활용품점',
  hardware_store: '철물점',
  paint_store: '페인트매장',
  florist: '꽃집',
  pet_store: '애완동물샵',
  book_store: '서점',
  bicycle_store: '자전거샵',
  liquor_store: '주류매장',
  drug_store: '약국',
  post_office: '우체국',
  police: '경찰서',
  fire_station: '소방서',
  courthouse: '법원',
  city_hall: '시청',
  embassy: '대사관',
  premise: '건물',
  establishment: '시설',
  point_of_interest: '관심장소',
};

/**
 * Google Places API의 types 배열을 사용자가 읽기 쉬운 한국어 카테고리로 변환
 * @param types Google Places API의 types 배열
 * @param maxCount 최대 표시할 카테고리 개수 (기본값: 2)
 * @returns 변환된 카테고리 문자열 (예: "음식점, 카페")
 */
export const formatPlaceTypes = (
  types?: string[],
  maxCount: number = 2,
): string => {
  if (!types || types.length === 0) {
    return '';
  }

  // 우선순위가 높은 타입들 (음식점 관련)
  const priorityTypes = ['restaurant', 'food', 'cafe', 'bakery', 'bar'];

  // 일반적이지 않은 타입들 제외
  const excludeTypes = ['establishment', 'point_of_interest', 'premise'];

  // 필터링된 타입들
  const filteredTypes = types.filter(
    type => !excludeTypes.includes(type) && PLACE_TYPE_MAPPING[type],
  );

  if (filteredTypes.length === 0) {
    return '';
  }

  // 우선순위 타입을 앞으로 정렬
  const sortedTypes = filteredTypes.sort((a, b) => {
    const aPriority = priorityTypes.indexOf(a);
    const bPriority = priorityTypes.indexOf(b);

    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    }
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    return 0;
  });

  // 최대 개수만큼 가져와서 한국어로 변환
  const categories = sortedTypes
    .slice(0, maxCount)
    .map(type => PLACE_TYPE_MAPPING[type])
    .filter(Boolean);

  return categories.join(', ');
};

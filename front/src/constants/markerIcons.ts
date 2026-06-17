export const MARKER_CATEGORIES = [
  {key: 'ramen', label: '라멘'},
  {key: 'bread', label: '빵'},
  {key: 'pizza', label: '피자'},
  {key: 'coffee', label: '커피'},
  {key: 'sushi', label: '스시'},
] as const;

export type MarkerCategory = (typeof MARKER_CATEGORIES)[number]['key'];

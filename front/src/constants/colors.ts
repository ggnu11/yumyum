// 디자인 가이드 기반 색상 팔레트
const common = {
  // Common
  COMMON_WHITE: '#FFFFFF',
  COMMON_BLACK: '#000000',

  // Grayscale
  GRAYSCALE_5: '#F7F7F7',
  GRAYSCALE_10: '#F2F2F2',
  GRAYSCALE_20: '#E7E7E7',
  GRAYSCALE_30: '#CCCCCC',
  GRAYSCALE_40: '#AAAAAA',
  GRAYSCALE_50: '#888888',
  GRAYSCALE_60: '#666666',
  GRAYSCALE_70: '#555555',
  GRAYSCALE_80: '#333333',
  GRAYSCALE_90: '#1A1A1A',

  // Red
  RED_10: '#FFE5E5',
  RED_50: '#FF8A8A',
  RED_100: '#E55555',

  // Yellow
  YELLOW_10: '#FFF5D0',
  YELLOW_50: '#FFE79C',
  YELLOW_100: '#FFC955',

  // LightGreen
  LIGHTGREEN_10: '#F0F7F0',
  LIGHTGREEN_50: '#C7F7B7',
  LIGHTGREEN_100: '#A0D468',

  // Green
  GREEN_10: '#D7F3D7',
  GREEN_50: '#8FD3A4',
  GREEN_100: '#47C07B',

  // Teal
  TEAL_10: '#D7F7F7',
  TEAL_50: '#8FD2E1',
  TEAL_100: '#4AD2AE',

  // Blue
  BLUE_10: '#E0F1FF',
  BLUE_50: '#8CCAFF',
  BLUE_100: '#4DA2DC',

  // Purple
  PURPLE_10: '#E8E4FF',
  PURPLE_20: '#D5CCFF',
  PURPLE_40: '#B59CFF',
  PURPLE_60: '#9A77FF',
  PURPLE_80: '#7E4EFF',
  PURPLE_100: '#6732FF',

  // Social Colors
  SOCIAL_KAKAO_BRAND: '#FEE500',
  SOCIAL_KAKAO_TEXT: '#000000',

  SOCIAL_NAVER_BRAND: '#03C75A',

  // Legacy colors (호환성을 위해 유지)
  PINK_200: '#FAE2E9',
  PINK_400: '#EC87A5',
  PINK_500: '#BF5C79',
  PINK_700: '#C63B64',
  RED_300: '#FFB4B4',
  RED_500: '#FF5F5F',
  BLUE_400: '#B4E0FF',
  BLUE_500: '#0D8AFF',
  GREEN_400: '#CCE6BA',
  YELLOW_400: '#FFE594',
  YELLOW_500: '#FACC15',
  PURPLE_400: '#C4C4E7',
  UNCHANGE_WHITE: '#fff',
  UNCHANGE_BLACK: '#000',
};

const colors = {
  light: {
    WHITE: '#FFF',
    GRAY_100: '#F8F8F8',
    GRAY_200: '#E7E7E7',
    GRAY_300: '#D8D8D8',
    GRAY_500: '#8E8E8E',
    GRAY_700: '#575757',
    BLACK: '#000',
    ...common,
  },
  dark: {
    WHITE: '#161616',
    GRAY_100: '#202124',
    GRAY_200: '#3C4043',
    GRAY_300: '#5e5e5e',
    GRAY_500: '#8E8E8E',
    GRAY_700: '#F8F8F8',
    BLACK: '#FFF',
    ...common,
  },
};

// Color System (디자인 가이드의 Color System 섹션)
const colorSystem = {
  // Primary Colors
  primary: {
    light: '#C4C4E7', // Purple30
    normal: '#7E4EFF', // Purple80
    strong: '#6732FF', // Purple100
    gradient: ['#6732FF', '#B59CFF'], // Purple100 to Purple40
  },

  // Secondary Colors
  secondary: {
    light: '#E8E4FF', // Purple10
    normal: '#D5CCFF', // Purple20
    strong: '#B59CFF', // Purple40
  },

  // Label Colors
  label: {
    white: common.COMMON_WHITE,
    disable: common.GRAYSCALE_20,
    assistive: common.GRAYSCALE_30,
    alternative: common.GRAYSCALE_50,
    neutral: common.GRAYSCALE_80,
    normal: common.GRAYSCALE_70,
    strong: common.GRAYSCALE_80,
  },

  // Background Colors
  background: {
    normal: common.COMMON_WHITE,
    gray: common.GRAYSCALE_10,
    pressed: common.COMMON_WHITE, // 100% opacity
    dim: common.COMMON_WHITE, // 100% opacity, but with dimming effect
  },

  // System Colors
  system: {
    success: common.GREEN_100,
    warning: common.YELLOW_100,
    error: common.RED_100,
    info: common.BLUE_100,

    success_low: common.GREEN_10,
    warning_low: common.YELLOW_10,
    error_low: common.RED_10,
    info_low: common.BLUE_10,
  },

  // Pin Colors
  pin: {
    red: common.RED_100,
    yellow: common.YELLOW_100,
    yellowGreen: common.LIGHTGREEN_100,
    teal: common.TEAL_100,
    blue: common.BLUE_100,

    red_gr: common.RED_50,
    yellow_gr: common.YELLOW_50,
    yellowGreen_gr: common.LIGHTGREEN_50,
    teal_gr: common.TEAL_50,
    blue_gr: common.BLUE_50,
  },

  // Social Colors
  social: {
    kakao: {
      container: common.SOCIAL_KAKAO_BRAND,
      label: common.SOCIAL_KAKAO_TEXT,
      symbol: common.COMMON_BLACK,
    },
    apple: {
      container: common.COMMON_BLACK,
      label: common.COMMON_WHITE,
    },
    naver: {
      container: common.SOCIAL_NAVER_BRAND,
      label: common.COMMON_WHITE,
    },
  },
};

// TypeScript 타입 정의
export type ColorKeys = keyof typeof common;
export type ThemeColors = typeof colors.light;
export type ColorSystemType = typeof colorSystem;
export type OpacityType = typeof opacity;

export interface DesignSystemColors {
  colors: typeof colors;
  colorSystem: ColorSystemType;
  opacity: OpacityType;
}

// Opacity values (디자인 가이드의 Opacity 섹션)
const opacity = {
  5: 0.05,
  10: 0.1,
  20: 0.2,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  80: 0.8,
  90: 0.9,
  100: 1.0,
};

export {colors, colorSystem, opacity};
export default {
  colors,
  colorSystem,
  opacity,
};

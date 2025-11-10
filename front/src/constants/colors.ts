// 디자인 가이드 기반 색상 팔레트
const common = {
  // Common
  0: '#FFFFFF',
  100: '#121212',

  // Grayscale
  GRAYSCALE_5: '#F7F7F7',
  GRAYSCALE_10: '#F2F2F2',
  GRAYSCALE_20: '#E7E7E7',
  GRAYSCALE_30: '#D0D0D0',
  GRAYSCALE_40: '#A9A9A9',
  GRAYSCALE_50: '#8D8E8F',
  GRAYSCALE_60: '#6A6A6A',
  GRAYSCALE_70: '#3D3D3D',
  GRAYSCALE_80: '#222222',
  GRAYSCALE_90: '#181818',

  // Red
  RED_10: '#FFECE8',
  RED_50: '#FFB3A4',
  RED_100: '#FB6E52',

  // Yellow
  YELLOW_10: '#FFF5DD',
  YELLOW_50: '#FFE7AC',
  YELLOW_100: '#FFCE55',

  // LightGreen
  LIGHTGREEN_10: '#F0FFDF',
  LIGHTGREEN_50: '#E0FFBF',
  LIGHTGREEN_100: '#A0D468',

  // Green
  GREEN_10: '#D3FFE3',
  GREEN_50: '#9AF9BA',
  GREEN_100: '#1EC05B',

  // Teal
  TEAL_10: '#DEFFF7',
  TEAL_50: '#ADF2E1',
  TEAL_100: '#48CFAE',

  // Blue
  BLUE_10: '#E6F1FF',
  BLUE_50: '#BDDAFF',
  BLUE_100: '#5D9CEC',

  // Purple
  PURPLE_10: '#EEEEFF',
  PURPLE_20: '#DEDEFF',
  PURPLE_40: '#C4C5FF',
  PURPLE_60: '#A9ABFF',
  PURPLE_80: '#8C8EF9',
  PURPLE_100: '#7C7EFF',

  // Social Colors
  SOCIAL_KAKAO_BRAND: '#FEE500',
  SOCIAL_KAKAO_TEXT: '#000000',

  SOCIAL_NAVER_BRAND: '#03C75A',

  // Legacy colors (호환성을 위해 유지)
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
    light: common.PURPLE_60, // Purple30
    normal: common.PURPLE_80, // Purple80
    strong: common.PURPLE_100, // Purple100
    gradient: [common.PURPLE_100, common.PURPLE_40], // Purple100 to Purple40
  },

  // Secondary Colors
  secondary: {
    light: common.PURPLE_10, // Purple10
    normal: common.PURPLE_20, // Purple20
    strong: common.PURPLE_40, // Purple40
  },

  // Label Colors
  label: {
    white: common[0],
    disable: common.GRAYSCALE_20,
    assistive: common.GRAYSCALE_30,
    alternative: common.GRAYSCALE_50,
    neutral: common.GRAYSCALE_60,
    normal: common.GRAYSCALE_70,
    strong: common.GRAYSCALE_80,
  },

  // Background Colors
  background: {
    normal: common[0],
    gray: common.GRAYSCALE_10,
    pressed: common[100],
    dim: common[100],
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
    gray: common.GRAYSCALE_30,
    black: common.GRAYSCALE_90,

    red_gr: [common.RED_100, common.RED_50],
    yellow_gr: [common.YELLOW_100, common.YELLOW_50],
    yellowGreen_gr: [common.GREEN_100, common.GREEN_50],
    teal_gr: [common.TEAL_100, common.TEAL_50],
    blue_gr: [common.BLUE_100, common.BLUE_50],
    gray_gr: [common.GRAYSCALE_5, common.GRAYSCALE_50],
    black_gr: [common.GRAYSCALE_50, common.GRAYSCALE_90],
  },

  // Social Colors
  social: {
    kakao: {
      container: common.SOCIAL_KAKAO_BRAND,
      label: common.SOCIAL_KAKAO_TEXT,
      symbol: common[100],
    },
    apple: {
      container: common[100],
      label: common[0],
    },
    naver: {
      container: common.SOCIAL_NAVER_BRAND,
      label: common[0],
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

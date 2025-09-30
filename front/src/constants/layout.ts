// Layout Guide System (디자인 가이드의 Layout Guide System)
export const layout = {
  ios: {
    basic: {
      // iPhone 13 mini 기준 (375 x 812px)
      screenWidth: 375,
      screenHeight: 812,
      columns: 4,
      type: 'stretch' as const,
      margin: 20,
      gutter: 16,
    },
  },
};

// Spacing values
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

// Border radius values
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Typography sizes
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 42,
    '4xl': 48,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Shadow values
export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export type LayoutType = typeof layout;
export type SpacingType = typeof spacing;
export type BorderRadiusType = typeof borderRadius;
export type TypographyType = typeof typography;
export type ShadowType = typeof shadow;

export default {
  layout,
  spacing,
  borderRadius,
  typography,
  shadow,
};

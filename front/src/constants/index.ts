// 전체 디자인 시스템 통합
import {colors, colorSystem, opacity} from './colors';
import {layout, spacing, borderRadius, typography, shadow} from './layout';

// 전체 디자인 시스템 타입
export interface DesignSystem {
  colors: typeof colors;
  colorSystem: typeof colorSystem;
  layout: typeof layout;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  shadow: typeof shadow;
  opacity: typeof opacity;
}

// 전체 디자인 시스템 객체
const designSystem: DesignSystem = {
  colors,
  colorSystem,
  layout,
  spacing,
  borderRadius,
  typography,
  shadow,
  opacity,
};

// 개별 export
export {
  colors,
  colorSystem,
  layout,
  spacing,
  borderRadius,
  typography,
  shadow,
  opacity,
};

// 기본 export
export default designSystem;

// 타입 export
export type {
  ColorKeys,
  ThemeColors,
  ColorSystemType,
  DesignSystemColors,
} from './colors';

export type {
  LayoutType,
  SpacingType,
  BorderRadiusType,
  TypographyType,
  ShadowType,
} from './layout';

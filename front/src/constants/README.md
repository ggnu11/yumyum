# Design System

디자인 가이드에 기반한 전체 디자인 시스템입니다.

## 사용법

### 전체 디자인 시스템 import

```typescript
import designSystem from '@/constants';
// 또는
import {colors, colorSystem, layout, spacing} from '@/constants';
```

### 색상 시스템

#### 기본 색상 팔레트

```typescript
import {colors} from '@/constants';

// 라이트/다크 테마 지원
const backgroundColor = colors.light.WHITE;
const textColor = colors.dark.BLACK;

// 공통 색상
const primaryColor = colors.light.PURPLE_100;
const grayColor = colors.light.GRAYSCALE_50;
```

#### Color System (의미론적 색상)

```typescript
import {colorSystem} from '@/constants';

// Primary colors
const primaryNormal = colorSystem.primary.normal;
const primaryLight = colorSystem.primary.light;

// Label colors
const labelNormal = colorSystem.label.normal;
const labelDisable = colorSystem.label.disable;

// System colors
const successColor = colorSystem.system.success;
const errorColor = colorSystem.system.error;

// Social colors
const kakaoColor = colorSystem.social.kakao.container;
const naverColor = colorSystem.social.naver.container;
```

### 레이아웃 시스템

#### 기본 레이아웃

```typescript
import {layout} from '@/constants';

const {screenWidth, screenHeight, margin, gutter} = layout.ios.basic;
// screenWidth: 375, screenHeight: 812, margin: 20, gutter: 16
```

#### 간격

```typescript
import {spacing} from '@/constants';

const marginHorizontal = spacing.md; // 16
const paddingVertical = spacing.lg; // 20
```

#### 테두리 둥글기

```typescript
import {borderRadius} from '@/constants';

const buttonRadius = borderRadius.md; // 12
const cardRadius = borderRadius.lg; // 16
```

### 타이포그래피

```typescript
import {typography} from '@/constants';

const titleSize = typography.fontSize['2xl']; // 24
const bodySize = typography.fontSize.base; // 16
const boldWeight = typography.fontWeight.bold; // '700'
```

### 그림자

```typescript
import {shadow} from '@/constants';

const cardShadow = shadow.md;
const buttonShadow = shadow.sm;
```

### 투명도

```typescript
import {opacity} from '@/constants';

const dimOpacity = opacity[50]; // 0.5
const overlayOpacity = opacity[80]; // 0.8
```

## 색상 팔레트

### Common Colors

- COMMON_WHITE: `#FFFFFF`
- COMMON_BLACK: `#000000`

### Grayscale (5-90)

- GRAYSCALE_10: `#F2F2F2`
- GRAYSCALE_50: `#888888`
- GRAYSCALE_80: `#333333`

### Primary Colors (Purple)

- PURPLE_10: `#E8E4FF`
- PURPLE_60: `#9A77FF`
- PURPLE_100: `#6732FF`

### System Colors

- GREEN_100: `#47C07B` (Success)
- YELLOW_100: `#FFC955` (Warning)
- RED_100: `#E55555` (Error)
- BLUE_100: `#4DA2DC` (Info)

### Social Colors

- SOCIAL_KAKAO_BRAND: `#FEE500`
- SOCIAL_NAVER_BRAND: `#03C75A`

## 레이아웃 가이드

### iOS Basic Layout

- Screen: 375 x 812px (iPhone 13 mini 기준)
- Columns: 4
- Type: Stretch
- Margin: 20px
- Gutter: 16px

### Spacing Scale

- xs: 4px
- sm: 8px
- md: 16px
- lg: 20px
- xl: 24px
- xxl: 32px

## TypeScript 지원

모든 색상과 레이아웃 값에 대한 타입 정의가 포함되어 있습니다.

```typescript
import type {DesignSystem, ColorSystemType, LayoutType} from '@/constants';

const useDesignSystem = (): DesignSystem => {
  return designSystem;
};
```

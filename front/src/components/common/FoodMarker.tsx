import React from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
  G,
} from 'react-native-svg';

import {MarkerCategory} from '@/constants/markerIcons';

interface FoodMarkerProps {
  category: MarkerCategory;
  score?: number;
  size?: number;
}

function getMouthPath(score: number, cx: number, cy: number, w: number) {
  const half = w / 2;
  if (score >= 4) {
    return `M${cx - half} ${cy} Q${cx} ${cy + half * 1.2} ${cx + half} ${cy}`;
  }
  if (score === 3) {
    return `M${cx - half} ${cy} L${cx + half} ${cy}`;
  }
  return `M${cx - half} ${cy} Q${cx} ${cy - half * 0.8} ${cx + half} ${cy}`;
}

function RamenMarker({score}: {score: number}) {
  const mouth = getMouthPath(score, 19, 24, 9);
  return (
    <Svg viewBox="0 0 38 38" width="100%" height="100%">
      <Ellipse cx={19} cy={22} rx={15} ry={11} fill="#fff" stroke="#d4823a" strokeWidth={1.4} />
      <Ellipse cx={19} cy={18} rx={12} ry={7} fill="#f5c87a" />
      <Path d="M8 17 Q14 13 19 17 Q24 13 30 17" fill="none" stroke="#c0682a" strokeWidth={1.3} />
      <Path d="M12 11 Q12 7 14 5" stroke="#aaa" strokeWidth={1} fill="none" />
      <Path d="M19 10 Q19 6 19 4" stroke="#aaa" strokeWidth={1} fill="none" />
      <Path d="M26 11 Q26 7 24 5" stroke="#aaa" strokeWidth={1} fill="none" />
      <Circle cx={14} cy={20} r={1.4} fill="#3a2a18" />
      <Circle cx={24} cy={20} r={1.4} fill="#3a2a18" />
      <Path d={mouth} fill="none" stroke="#3a2a18" strokeWidth={1.3} strokeLinecap="round" />
      <Ellipse cx={11.5} cy={22.5} rx={2} ry={1.3} fill="#f5a3a3" opacity={0.7} />
      <Ellipse cx={26.5} cy={22.5} rx={2} ry={1.3} fill="#f5a3a3" opacity={0.7} />
    </Svg>
  );
}

function BreadMarker({score}: {score: number}) {
  const mouth = getMouthPath(score, 19, 25.5, 9);
  return (
    <Svg viewBox="0 0 38 38" width="100%" height="100%">
      <Rect x={9} y={14} width={20} height={15} rx={6} fill="#fff" stroke="#b07030" strokeWidth={1.4} />
      <Rect x={9} y={14} width={20} height={6} rx={3} fill="#d4a868" />
      <Path d="M13 9 Q13 6 15 4" stroke="#b8a888" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Path d="M19 8 Q19 5 19 3" stroke="#b8a888" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Path d="M25 9 Q25 6 23 4" stroke="#b8a888" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Circle cx={14} cy={22} r={1.4} fill="#3a2a18" />
      <Circle cx={24} cy={22} r={1.4} fill="#3a2a18" />
      <Path d={mouth} fill="none" stroke="#3a2a18" strokeWidth={1.3} strokeLinecap="round" />
      <Ellipse cx={11.5} cy={24} rx={1.8} ry={1.2} fill="#f5a3a3" opacity={0.6} />
      <Ellipse cx={26.5} cy={24} rx={1.8} ry={1.2} fill="#f5a3a3" opacity={0.6} />
    </Svg>
  );
}

function PizzaMarker({score}: {score: number}) {
  const mouth = getMouthPath(score, 19, 26.5, 7);
  return (
    <Svg viewBox="0 0 38 38" width="100%" height="100%">
      <Path d="M19 8 L31 28 L7 28 Z" fill="#f5c060" stroke="#d4823a" strokeWidth={1.4} />
      <Circle cx={16} cy={20} r={2} fill="#e05050" />
      <Circle cx={22} cy={23} r={1.7} fill="#e05050" />
      <Circle cx={20} cy={17} r={1.5} fill="#e05050" />
      <Circle cx={14.5} cy={24} r={1.2} fill="#3a2a18" />
      <Circle cx={23.5} cy={24} r={1.2} fill="#3a2a18" />
      <Path d={mouth} fill="none" stroke="#3a2a18" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

function CoffeeMarker({score}: {score: number}) {
  const mouth = getMouthPath(score, 19, 21.5, 8);
  return (
    <Svg viewBox="0 0 38 38" width="100%" height="100%">
      <Rect x={13} y={11} width={12} height={16} rx={3} fill="#fff" stroke="#9d8050" strokeWidth={1.3} />
      <Path d="M25 16 Q30 16 30 20 Q30 24 25 24" fill="none" stroke="#9d8050" strokeWidth={1.3} />
      <Path d="M16 8 Q16 6 17 4" stroke="#b0b0b0" strokeWidth={1} fill="none" />
      <Path d="M19 7 Q19 5 19 3" stroke="#b0b0b0" strokeWidth={1} fill="none" />
      <Circle cx={16.5} cy={18} r={1.3} fill="#3a2a18" />
      <Circle cx={21.5} cy={18} r={1.3} fill="#3a2a18" />
      <Path d={mouth} fill="none" stroke="#3a2a18" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

function SushiMarker({score}: {score: number}) {
  const mouth = getMouthPath(score, 19, 24, 8);
  return (
    <Svg viewBox="0 0 38 38" width="100%" height="100%">
      <Rect x={9} y={17} width={20} height={9} rx={4.5} fill="#fff" stroke="#b0c8e0" strokeWidth={1.3} />
      <Rect x={12} y={19} width={14} height={6} rx={3} fill="#f08060" />
      <Rect x={14} y={14} width={10} height={3} rx={1.5} fill="#2a4020" opacity={0.85} />
      <Circle cx={14.5} cy={21.5} r={1.1} fill="#3a2a18" />
      <Circle cx={23.5} cy={21.5} r={1.1} fill="#3a2a18" />
      <Path d={mouth} fill="none" stroke="#3a2a18" strokeWidth={1.1} strokeLinecap="round" />
    </Svg>
  );
}

const MARKER_COMPONENTS: Record<MarkerCategory, React.FC<{score: number}>> = {
  ramen: RamenMarker,
  bread: BreadMarker,
  pizza: PizzaMarker,
  coffee: CoffeeMarker,
  sushi: SushiMarker,
};

function FoodMarker({category, score = 3, size = 38}: FoodMarkerProps) {
  const MarkerComponent = MARKER_COMPONENTS[category];

  return (
    <View style={{width: size, height: size}}>
      <MarkerComponent score={score} />
    </View>
  );
}

export default FoodMarker;

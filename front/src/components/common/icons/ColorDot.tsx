import React from 'react';
import {View, StyleSheet} from 'react-native';

interface ColorDotProps {
  size?: number;
  color: string;
}

function ColorDot({size = 12, color}: ColorDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    // 기본 스타일은 props로 동적 설정
  },
});

export default ColorDot;

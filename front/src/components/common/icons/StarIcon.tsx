import React from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

interface StarIconProps {
  size?: number;
  color?: string;
  fill?: boolean;
}

function StarIcon({size = 16, color = '#000', fill = true}: StarIconProps) {
  return (
    <FontAwesome6
      name="star"
      size={size}
      color={color}
      iconStyle={fill ? 'solid' : 'regular'}
    />
  );
}

export default StarIcon;

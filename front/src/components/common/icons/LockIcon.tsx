import React from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

interface LockIconProps {
  size?: number;
  color?: string;
}

function LockIcon({size = 16, color = '#000'}: LockIconProps) {
  return (
    <FontAwesome6 name="lock" size={size} color={color} iconStyle="solid" />
  );
}

export default LockIcon;

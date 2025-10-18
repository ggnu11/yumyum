import React from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

interface UsersIconProps {
  size?: number;
  color?: string;
}

function UsersIcon({size = 16, color = '#000'}: UsersIconProps) {
  return (
    <FontAwesome6 name="users" size={size} color={color} iconStyle="solid" />
  );
}

export default UsersIcon;

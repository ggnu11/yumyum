import React from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

interface UserGroupIconProps {
  size?: number;
  color?: string;
}

function UserGroupIcon({size = 16, color = '#000'}: UserGroupIconProps) {
  return (
    <FontAwesome6
      name="user-group"
      size={size}
      color={color}
      iconStyle="solid"
    />
  );
}

export default UserGroupIcon;

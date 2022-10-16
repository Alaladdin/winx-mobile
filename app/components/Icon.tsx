import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleProp, TouchableOpacityProps, ViewStyle } from 'react-native';
import { TouchableRipple, TouchableRippleProps } from 'react-native-paper';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import theme from '../theme';

interface IconProps extends TouchableOpacityProps {
  ripperProps?: TouchableRippleProps;
  ripperStyle?: StyleProp<ViewStyle>;
  icon: IconProp;
  color?: string;
  size?: number;
  onPress?: TouchableOpacityProps['onPress'];
}

// todo touachable wrapper add

export function Icon(props: IconProps) {
  const { ripperProps, ripperStyle, icon, color, size, onPress } = props;

  return (
    <TouchableRipple { ...ripperProps } style={ ripperStyle } onPress={ onPress }>
      <FontAwesomeIcon
        icon={ icon }
        color={ color || theme.colors.onBackground }
        size={ size }
      />
    </TouchableRipple>
  );
}

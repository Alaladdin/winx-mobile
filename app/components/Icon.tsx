import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TouchableOpacityProps } from 'react-native';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import theme from '../theme';

interface IconProps extends TouchableOpacityProps {
  icon: IconProp;
  color?: string;
  size?: number;
  onPress?: TouchableOpacityProps['onPress'];
}
// touachable wrapper add
export function Icon(props: IconProps) {
  const { icon, color, size, onPress } = props;

  return (
    <FontAwesomeIcon
      icon={ icon }
      color={ color || theme.colors.onBackground }
      size={ size }
      onPress={ onPress }
    />
  );
}

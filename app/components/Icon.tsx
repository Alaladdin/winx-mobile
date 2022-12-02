import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleProp, StyleSheet, TouchableOpacityProps, View, ViewStyle } from 'react-native';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import theme from '@/theme';

interface IconProps extends TouchableOpacityProps {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  icon: IconProp;
  color?: string;
  size?: number;
}

export function Icon(props: IconProps) {
  const { containerStyle, style, icon, color, size } = props;

  return (
    <View style={ [styles.container, containerStyle] }>
      <FontAwesomeIcon
        style={ style }
        icon={ icon }
        color={ color || theme.colors.onBackground }
        size={ size }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex          : 1,
    justifyContent: 'center',
  },
});

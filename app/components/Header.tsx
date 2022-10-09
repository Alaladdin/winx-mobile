import React from 'react';
import { Appbar, MD3DarkTheme } from 'react-native-paper';
import { TouchableOpacityProps } from 'react-native';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Icon } from './Icon';
import { translate, TxKeyPath } from '../i18n';

export interface HeaderProps {
  title?: TxKeyPath
  leftIcon?: IconProp
  leftIconColor?: string
  onLeftPress?: TouchableOpacityProps['onPress']
  rightIcon?: IconProp
  rightIconColor?: string
  onRightPress?: TouchableOpacityProps['onPress']
}

export function Header(props: HeaderProps) {
  const {
    title,

    leftIcon,
    leftIconColor,
    onLeftPress,

    rightIcon,
    rightIconColor,
    onRightPress,
  } = props;

  return (
    <Appbar.Header
      theme={ MD3DarkTheme }
      statusBarHeight={ 0 }
      elevated
    >
      {!!title && (
        <Appbar.Content
          color={ MD3DarkTheme.colors.onBackground }
          title={ translate(title) }
        />
      )}

      {!!leftIcon && (
        <Appbar.Action
          icon={ () => (<Icon icon={ leftIcon } color={ leftIconColor } />) }
          disabled
          onPress={ onLeftPress }
        />
      )}

      {!!rightIcon && (
        <Appbar.Action
          icon={ () => (<Icon icon={ rightIcon } color={ rightIconColor } />) }
          disabled
          onPress={ onRightPress }
        />
      )}
    </Appbar.Header>
  );
}

import React from 'react';
import { Appbar, MD3DarkTheme } from 'react-native-paper';
import { TouchableOpacityProps } from 'react-native';
import { Icon } from './Icon';
import { translate, TxKeyPath } from '../i18n';

export interface HeaderProps {
  title?: TxKeyPath
  // leftIcon?: IconTypes
  leftIconColor?: string
  onLeftPress?: TouchableOpacityProps['onPress']
  // rightIcon?: IconTypes
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

  const titleContent = translate(title);

  return (
    <Appbar.Header theme={ MD3DarkTheme }>
      {!!titleContent && (
        <Appbar.Content
          color={ MD3DarkTheme.colors.onBackground }
          title={ titleContent }
        />
      )}

      {!!leftIcon && (
        <Appbar.Action
          icon={ () => (<Icon icon={ leftIcon } color={ leftIconColor } />) }
          onPress={ onLeftPress }
        />
      )}

      {!!rightIcon && (
        <Appbar.Action
          icon={ () => (<Icon icon={ rightIcon } color={ rightIconColor } />) }
          onPress={ onRightPress }
        />
      )}
    </Appbar.Header>

  );
}

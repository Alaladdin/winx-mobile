import React from 'react';
import { Appbar, Avatar, MD3DarkTheme } from 'react-native-paper';
import { translate, TxKeyPath } from '../i18n';
import config from '../config';

export interface HeaderProps {
  title?: TxKeyPath
  onAvatarPress?: () => void
}

export function Header(props: HeaderProps) {
  const { title, onAvatarPress } = props;
  const renderAvatar = () => (
    <Avatar.Image
      size={ 24 }
      source={ { uri: config.avatarBaseUrl } }
    />
  );

  return (
    <Appbar.Header
      theme={ MD3DarkTheme }
      statusBarHeight={ 0 }
      elevated
    >
      {!!title && <Appbar.Content title={ translate(title) } />}

      <Appbar.Action
        icon={ renderAvatar }
        onPress={ onAvatarPress }
      />
    </Appbar.Header>
  );
}

import React from 'react';
import { Appbar, Avatar, MD3DarkTheme } from 'react-native-paper';
import config from '../config';

export interface HeaderProps {
  onAvatarPress?: () => void
}

export function Header(props: HeaderProps) {
  const { onAvatarPress } = props;
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
      <Appbar.Content title="WINX" />

      <Appbar.Action
        icon={ renderAvatar }
        onPress={ onAvatarPress }
      />
    </Appbar.Header>
  );
}

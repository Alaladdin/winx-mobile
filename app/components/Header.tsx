import React from 'react';
import { Appbar, Avatar, MD3DarkTheme } from 'react-native-paper';
import config from '@/config';
import appConfig from '@/../app.json';

export interface HeaderProps {
  onAvatarPress?: () => void
}

export function Header(props: HeaderProps) {
  const { onAvatarPress } = props;
  const avatarSourceOptions = { uri: `${config.avatarBaseUrl}avatar/default`, width: 24, height: 24 };
  const renderAvatar = () => (
    <Avatar.Image
      size={ 24 }
      source={ avatarSourceOptions }
    />
  );

  return (
    <Appbar.Header
      theme={ MD3DarkTheme }
      statusBarHeight={ 0 }
      elevated
    >
      <Appbar.Content title={ appConfig.expo.name } />

      <Appbar.Action
        icon={ renderAvatar }
        onPress={ onAvatarPress }
      />
    </Appbar.Header>
  );
}

import { useMemo } from 'react';
import { Appbar, Avatar } from 'react-native-paper';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { applicationName } from 'expo-application';
import config from '@/config';
import { Icon } from '@/components/Icon';

export interface HeaderProps {
  avatar?: string;
  icon?: IconProp;
  onBackPress?: () => void;
  onAvatarPress?: () => void;
}

export function Header({ avatar, icon, onBackPress, onAvatarPress }: HeaderProps) {
  const headerIcon = useMemo(() => <Icon icon={ icon } />, [icon]);
  const headerAvatar = useMemo(() => (
    <Avatar.Image
      size={ 24 }
      source={ {
        uri   : `${config.imageBaseUrl}${avatar}`,
        width : 24,
        height: 24,
      } }
    />
  ), [avatar]);

  const headerAction = useMemo(() => {
    if (!icon && !avatar) return null;

    return (
      <Appbar.Action
        icon={ () => (avatar ? headerAvatar : headerIcon) }
        onPress={ onAvatarPress }
      />
    );
  }, [avatar, icon, headerAvatar, headerIcon, onAvatarPress]);

  return (
    <Appbar.Header statusBarHeight={ 0 } elevated>
      { !!onBackPress && (<Appbar.BackAction onPress={ onBackPress } />) }

      <Appbar.Content title={ applicationName } />

      { headerAction }
    </Appbar.Header>
  );
}

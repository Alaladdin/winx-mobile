import { useMemo } from 'react';
import { Appbar, Avatar } from 'react-native-paper';
import { observer } from 'mobx-react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { StyleSheet, View } from 'react-native';
import config from '@/config';
import appConfig from '../../app.config';
import { Icon } from '@/components/Icon';

export interface HeaderProps {
  avatar?: string;
  icon?: IconProp;
  onBackPress?: () => void;
  onAvatarPress?: () => void;
}

export const Header = observer((props: HeaderProps) => {
  const { avatar, icon, onBackPress, onAvatarPress } = props;
  const headerIcon = useMemo(() => <View style={ styles.iconContainer }><Icon icon={ icon } /></View>, [icon]);
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

  return (
    <Appbar.Header statusBarHeight={ 0 } elevated>
      { !!onBackPress && (<Appbar.BackAction onPress={ onBackPress } />) }

      <Appbar.Content title={ appConfig.name } />

      {
          (!!avatar || !!icon) && (
          <Appbar.Action
            icon={ () => (avatar ? headerAvatar : headerIcon) }
            onPress={ onAvatarPress }
          />
          )
        }

    </Appbar.Header>
  );
});

const styles = StyleSheet.create({
  iconContainer: {
    flex          : 1,
    justifyContent: 'center',
    alignItems    : 'center',
  },
});

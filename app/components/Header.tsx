import { useMemo } from 'react';
import { Appbar, Avatar } from 'react-native-paper';
import { observer } from 'mobx-react';
import config from '@/config';
import appConfig from '../../app.config';

export interface HeaderProps {
  avatar?: string;
  onBackPress?: () => void;
  onAvatarPress?: () => void;
}

export const Header = observer((props: HeaderProps) => {
  const { avatar, onBackPress, onAvatarPress } = props;
  const HeaderAvatar = () => useMemo(() => (
    <Avatar.Image
      size={ 24 }
      source={ {
        uri   : `${config.avatarBaseUrl}${avatar}`,
        width : 24,
        height: 24,
      } }
    />
  ), [avatar]);

  return (
    <Appbar.Header statusBarHeight={ 0 } elevated>
      { !!onBackPress && (<Appbar.BackAction onPress={ onBackPress } />) }

      <Appbar.Content title={ appConfig.name } />

      { !!avatar && (
        <Appbar.Action
          icon={ HeaderAvatar }
          onPress={ onAvatarPress }
        />
      )}
    </Appbar.Header>
  );
});

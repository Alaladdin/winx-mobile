import { BottomNavigation } from 'react-native-paper';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { reject } from 'lodash/collection';
import { reaction } from 'mobx';
import { translate } from '../i18n';
import { Icon } from '../components';
import theme from '../theme';
import { routesList, INavRoute, routesMapForMav } from './routes';
import { useStores } from '../models';

const renderIcon = (params: { route: INavRoute, color: string, focused: boolean }) => {
  const { focusedIcon, unfocusedIcon } = params.route;
  const icon = (!params.focused && unfocusedIcon) ? unfocusedIcon : focusedIcon;

  return (
    <View style={ styles.iconContainer }>
      <Icon
        icon={ icon }
        color={ params.color }
        size={ 16 }
      />
    </View>
  );
};

interface IMainNavProps {
  badges?: {
    [key: string]: number | null
  }
}

export const MainNavigator = observer(({ badges = {} }: IMainNavProps) => {
  const { mainStore } = useStores();
  const [index, setIndex] = useState(0);
  const routesWithAuth = mainStore.isAuthenticated ? routesList : reject(routesList, 'withAuth');
  const renderScene = BottomNavigation.SceneMap(routesMapForMav);

  reaction(() => mainStore.isAuthenticated, (isAuthenticated) => {
    setIndex(index + (isAuthenticated ? 2 : -2));
  });

  return (
    <BottomNavigation
      navigationState={ { index, routes: routesWithAuth } }
      renderScene={ renderScene }
      getLabelText={ ({ route }) => translate(route.title) }
      activeColor={ theme.colors.primary }
      getBadge={ ({ route }) => badges[route.key] } // todo remove
      renderIcon={ renderIcon }
      onIndexChange={ setIndex }
    />
  );
});

const styles = StyleSheet.create({
  iconContainer: {
    flex          : 1,
    justifyContent: 'center',
  },
});

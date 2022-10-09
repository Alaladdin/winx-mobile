import { BottomNavigation } from 'react-native-paper';
import React, { useState } from 'react';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { StyleSheet, View } from 'react-native';
import { map, keys } from 'lodash';
import { ActualityScreen, BarsScreen, ScheduleScreen, SettingsScreen } from '../screens';
import { translate, TxKeyPath } from '../i18n';
import { Icon, Screen } from '../components';
import theme from '../theme';

export type Route = {
  key: string
  title: TxKeyPath
  focusedIcon: IconProp
  unfocusedIcon?: IconProp
  component: React.Component
}

export type Routes = [Route]
const rawRoutes = {
  schedule: {
    title      : 'mainNavigator.scheduleTab',
    focusedIcon: 'calendar-days',
    component  : ScheduleScreen,
  },
  actuality: {
    title      : 'mainNavigator.actualityTab',
    focusedIcon: 'newspaper',
    component  : ActualityScreen,
  },
  bars: {
    title      : 'mainNavigator.barsTab',
    focusedIcon: 'book',
    component  : BarsScreen,
  },
  settings: {
    title      : 'mainNavigator.settingsTab',
    focusedIcon: 'bars',
    component  : SettingsScreen,
  },
};

const routes = map(keys(rawRoutes), (key) => ({ key, ...rawRoutes[key] }));

const renderIcon = (params: { route: Route, color: string, focused: boolean }) => {
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

const renderScene = ({ route, jumpTo }) => (
  <Screen
    headerProps={ {
      title    : route.title,
      leftIcon : 'bell',
      rightIcon: 'user-astronaut',
    } }
  >
    <route.component route={ route } jumpTo={ jumpTo } />
  </Screen>
);

export function MainNavigator() {
  const [index, setIndex] = useState(0);

  return (
    <BottomNavigation
      navigationState={ { index, routes } }
      renderScene={ renderScene }
      getLabelText={ ({ route }) => translate(route.title) }
      activeColor={ theme.colors.primary }
      renderIcon={ renderIcon }
      onIndexChange={ setIndex }
      compact
    />
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flex          : 1,
    display       : 'flex',
    alignItems    : 'center',
    justifyContent: 'center',
  },
});

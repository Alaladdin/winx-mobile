import { keys, map } from 'lodash';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Route } from '@react-navigation/native';
import * as screens from '@/screens';
import { translate } from '@/i18n';

export interface IRoute {
  [key: string] :{
    name: string
    title: string
    icon: IconProp
    component: ({ navigation }: { navigation: any, route: Route<any> }) => JSX.Element
  }
}

export const routesMap: IRoute = {
  schedule: {
    name     : 'schedule',
    title    : translate('mainNavigator.scheduleTab'),
    icon     : 'calendar-days',
    component: screens.ScheduleScreen,
  },
  actuality: {
    name     : 'actuality',
    title    : translate('mainNavigator.actualityTab'),
    icon     : 'newspaper',
    component: screens.ActualityScreen,
  },
  settings: {
    name     : 'settings',
    title    : translate('mainNavigator.settingsTab'),
    icon     : 'bars',
    component: screens.SettingsScreen,
  },
};

export const routesList = map(keys(routesMap), (key) => routesMap[key]);

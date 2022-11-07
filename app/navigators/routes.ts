import { keys, map } from 'lodash';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Route } from '@react-navigation/native';
import * as screens from '@/screens';
import { translate } from '@/i18n';

type UserScope = 'guest' | 'user' | 'admin' | 'owner'

export interface IRoute {
  [key: string] :{
    name: string;
    title: string;
    icon: IconProp;
    scope?: UserScope;
    component: ({ navigation }: { navigation: any, route: Route<any> }) => JSX.Element;
  }
}

export const routesMap: IRoute = {
  schedule: {
    name     : 'Schedule',
    title    : translate('mainNavigator.scheduleTab'),
    icon     : 'calendar-days',
    component: screens.ScheduleScreen,
  },
  actuality: {
    name     : 'Actuality',
    title    : translate('mainNavigator.actualityTab'),
    icon     : 'newspaper',
    component: screens.ActualityScreen,
  },
  bars: {
    name     : 'Bars',
    title    : translate('mainNavigator.barsTab'),
    icon     : 'book',
    scope    : 'user',
    component: screens.BarsScreen,
  },
  mail: {
    name     : 'Mail',
    title    : translate('mainNavigator.mailTab'),
    icon     : 'envelope',
    scope    : 'user',
    component: screens.MailScreen,
  },
  settings: {
    name     : 'Settings',
    title    : translate('mainNavigator.settingsTab'),
    icon     : 'bars',
    component: screens.SettingsScreen,
  },
};

export const routesList = map(keys(routesMap), (key) => routesMap[key]);

import { keys, map } from 'lodash';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import * as screens from '@/screens';
import { TxKeyPath } from '@/i18n';

export interface INavRoute {
  key: string
  title: TxKeyPath
  focusedIcon: IconProp
  unfocusedIcon?: IconProp
  component: React.Component
}

export interface IRoute {
  [key: string] :{
    title: TxKeyPath
    focusedIcon: IconProp
    component: JSX.Element
  }
}

export interface IRoutes {
  [index:number]: IRoute;
}

export const routesMap: IRoute = {
  schedule: {
    title      : 'mainNavigator.scheduleTab',
    focusedIcon: 'calendar-days',
    component  : screens.ScheduleScreen,
  },
  actuality: {
    title      : 'mainNavigator.actualityTab',
    focusedIcon: 'newspaper',
    component  : screens.ActualityScreen,
  },
  bars: {
    title      : 'mainNavigator.barsTab',
    focusedIcon: 'book',
    withAuth   : true, // scope: 'user',
    component  : screens.BarsScreen,
  },
  mail: {
    title      : 'mainNavigator.mailTab',
    focusedIcon: 'envelope',
    withAuth   : true, // scope: 'user',
    component  : screens.MailScreen,
  },
  settings: {
    title      : 'mainNavigator.settingsTab',
    focusedIcon: 'bars',
    component  : screens.SettingsScreen,
  },
};

export const routesList = map(keys(routesMap), (key) => ({ key, ...routesMap[key] }));
export const routesMapForMav = {
  schedule : screens.ScheduleScreen,
  actuality: screens.ActualityScreen,
  bars     : screens.BarsScreen,
  mail     : screens.MailScreen,
  settings : screens.SettingsScreen,
};

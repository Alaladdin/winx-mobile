import React from 'react';
import { Screen } from '../components';
import { DemoTabScreenProps } from '../navigators/MainNavigator';
// import { reportCrash } from '../utils/crash-reporting'

export function BarsScreen(_props: DemoTabScreenProps<'Bars'>) {
  // reportCrash(new Error('My first Sentry error!'))

  return (
    <Screen
      preset="scroll"
      HeaderProps={ {
        title    : 'mainNavigator.barsTab',
        leftIcon : 'bell',
        rightIcon: 'user-astronaut',
      } }
    />
  );
}

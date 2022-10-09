import React from 'react';
import { Text } from 'react-native-paper';
import { Route } from '../navigators/MainNavigator';
// import { DemoTabScreenProps } from '../navigators/MainNavigator';
// import { reportCrash } from '../utils/crash-reporting'

// _props: DemoTabScreenProps<'Bars'>
export function BarsScreen({ route }: { route: Route }) {
  // reportCrash(new Error('My first Sentry error!'))
  return (
    <Text>{ route.title }</Text>
  );
}

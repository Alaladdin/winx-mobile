import React from 'react';
import { Text } from 'react-native-paper';
import { Route } from '../navigators/MainNavigator';

export function ActualityScreen({ route } : {route: Route}) {
  return (
    <Text>{ route.title }</Text>
  );
}

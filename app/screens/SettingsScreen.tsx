import React from 'react';
import { Text } from 'react-native-paper';

export function SettingsScreen({ route }) {
  return (
    <Text>{ route.title }</Text>
  );
}

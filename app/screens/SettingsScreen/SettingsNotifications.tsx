import React from 'react';
import { List, Text, Switch } from 'react-native-paper';
import { View } from 'react-native';
import { ISettingSection } from './ISettingSection';

export function SettingsNotifications({ headingStyle }: ISettingSection) {
  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Notifications</Text>

      <List.Item
        title="About lessons"
        right={ () => (<Switch value={ false } disabled />) }
      />

      <List.Item
        title="About bars marks change"
        right={ () => (<Switch value={ false } disabled />) }
      />
    </View>
  );
}

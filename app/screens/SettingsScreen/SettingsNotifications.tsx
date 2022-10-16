import React, { useMemo } from 'react';
import { List, Text, Switch } from 'react-native-paper';
import { View } from 'react-native';
import { ISettingSection } from './ISettingSection';

export function SettingsNotifications({ headingStyle }: ISettingSection) {
  const disabledSwitch = useMemo(() => <Switch value={ false } disabled />, []);

  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Notifications</Text>

      <List.Item
        title="About lessons"
        right={ () => disabledSwitch }
      />

      <List.Item
        title="About bars marks change"
        right={ () => disabledSwitch }
      />
    </View>
  );
}

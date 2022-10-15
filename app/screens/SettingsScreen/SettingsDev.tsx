import { List, Switch, Text } from 'react-native-paper';
import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { useStores } from '../../models';
import { ISettingSection } from './ISettingSection';

const AuthenticationSwitch = observer(() => {
  const { mainStore } = useStores();
  const onValueChange = (newVal) => {
    mainStore.setAuthToken(newVal ? 'true' : '');
  };

  return (
    <Switch
      value={ mainStore.isAuthenticated }
      onValueChange={ onValueChange }
    />
  );
});

export function SettingsDev({ headingStyle }: ISettingSection) {
  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Dev</Text>
      <List.Item
        title="Is authenticated"
        right={ () => <AuthenticationSwitch /> }
      />
    </View>
  );
}

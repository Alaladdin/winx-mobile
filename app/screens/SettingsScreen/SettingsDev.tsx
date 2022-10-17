import { Button, List, Switch, Text } from 'react-native-paper';
import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import * as Notifications from 'expo-notifications';
import { useStores } from '@/models';
import { ISettingSection } from './ISettingSection';
import { reportCrash } from '@/utils/crash-reporting';

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
  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Гера воняет',
        body : 'Притом жесска',
      },
      trigger: null,
    })
      .catch(reportCrash);
  };

  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Dev</Text>
      <List.Item
        title="Is authenticated"
        right={ () => <AuthenticationSwitch /> }
      />

      <List.Item
        title="Test notification"
        right={ () => <Button onPress={ sendNotification }>Send notification</Button> }
      />
    </View>
  );
}

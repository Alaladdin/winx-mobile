import { Button, List, Text } from 'react-native-paper';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ISettingSection } from './ISettingSection';
import { reportCrash } from '@/utils/crash-reporting';

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

  const sendNotificationButton = useMemo(() => (
    <Button onPress={ sendNotification }>Send notification</Button>
  ), []);

  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Dev</Text>

      <List.Item
        title="Test notification"
        right={ () => sendNotificationButton }
      />
    </View>
  );
}

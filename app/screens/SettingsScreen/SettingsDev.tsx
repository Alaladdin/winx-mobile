import { Button, List, Text } from 'react-native-paper';
import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import * as Notifications from 'expo-notifications';
import crashlytics from '@react-native-firebase/crashlytics';
import { ISettingSection } from './ISettingSection';
import { reportCrash } from '@/utils/crash-reporting';
import { clear } from '@/utils/storage';

export function SettingsDev({ headingStyle, setSnackBarMessage }: ISettingSection) {
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

  const clearStorage = useCallback(() => {
    clear()
      .then(() => {
        setSnackBarMessage('Now, you need to reload app');
      })
      .catch(() => {
        setSnackBarMessage('Storage clearing error');
      });
  }, []);

  const sendNotificationButton = useMemo(() => (
    <Button onPress={ sendNotification }>Send notification</Button>
  ), []);

  const crashAppButton = useMemo(() => (
    <Button onPress={ () => crashlytics().crash() }>Crash app</Button>
  ), []);

  const clearStorageButton = useMemo(() => (
    <Button onPress={ clearStorage }>Clear</Button>
  ), []);

  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Dev</Text>

      <List.Item
        title="Notifications"
        right={ () => sendNotificationButton }
      />

      <List.Item
        title="Analytics"
        right={ () => crashAppButton }
      />

      <List.Item
        title="Storage"
        right={ () => clearStorageButton }
      />
    </View>
  );
}

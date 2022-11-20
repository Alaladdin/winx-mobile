import { Button, List } from 'react-native-paper';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ISettingSection } from './ISettingSection';
import { reportCrash } from '@/utils/crash-reporting';
import { clear } from '@/utils/storage';

export function SettingsDev({ setSnackBarMessage }: ISettingSection) {
  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Дима воняет 😳',
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
    <Button onPress={ sendNotification }>Send</Button>
  ), []);

  const clearStorageButton = useMemo(() => (
    <Button onPress={ clearStorage }>Clear</Button>
  ), []);

  return (
    <View>
      <List.Item
        title="Notifications"
        right={ () => sendNotificationButton }
        style={ styles.listItem }
      />

      <List.Item
        title="App storage"
        right={ () => clearStorageButton }
        style={ styles.listItem }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 0,
  },
});

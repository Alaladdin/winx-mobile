import { Button, List } from 'react-native-paper';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, ToastAndroid } from 'react-native';
import * as Notifications from 'expo-notifications';
import { reportCrash } from '@/utils/crash-reporting';
import { clear } from '@/utils/storage';
import { useStores } from '@/models';

export function SettingsDev() {
  const { setSnackBarOptions } = useStores().mainStore;
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
      .then((isCleared) => {
        const options = isCleared
          ? ['Now, you need to reload app', 'success']
          : ['Storage clearing error', 'error'];

        setSnackBarOptions(options[0], options[1]);
      });
  }, [setSnackBarOptions]);

  const sendNotificationButton = useMemo(() => (
    <Button onPress={ sendNotification }>Send</Button>
  ), []);

  const showToastButton = useMemo(() => (
    <Button onPress={ () => ToastAndroid.show('Тут уже черт знает, кто воняет', ToastAndroid.LONG) }>Show</Button>
  ), []);

  const clearStorageButton = useMemo(() => (
    <Button onPress={ clearStorage }>Clear</Button>
  ), [clearStorage]);

  return (
    <View>
      <List.Item
        title="Notifications"
        right={ () => sendNotificationButton }
        style={ styles.listItem }
      />

      <List.Item
        title="Toast"
        right={ () => showToastButton }
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

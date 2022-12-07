import * as Notifications from 'expo-notifications';
import each from 'lodash/each';
import { ISendNotificationProps } from './notifications.types';
import { reportCrash } from '@/utils/crash-reporting';

const notificationsChannelsOptions = [
  { id: 'schedule', name: 'Lessons' },
  { id: 'actuality', name: 'Actualities changes' },
  { id: 'mail', name: 'New mails' },
  { id: 'bars', name: 'New bars marks' },
];

export const initNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge : false,
    }),
  });

  each(notificationsChannelsOptions, (channel) => {
    Notifications.setNotificationChannelAsync(channel.id, {
      name         : channel.name,
      importance   : Notifications.AndroidImportance.DEFAULT,
      enableVibrate: true,
    });
  });
};

export async function sendNotification(props: ISendNotificationProps) {
  return Notifications.scheduleNotificationAsync({
    identifier: props.identifier,
    content   : {
      title: props.title,
      body : props.body,
    },
    trigger: props.trigger || null,
  })
    .catch((err) => {
      reportCrash(err);

      throw err;
    });
}

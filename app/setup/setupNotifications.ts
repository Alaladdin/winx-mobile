import * as Notifications from 'expo-notifications';
import each from 'lodash/each';

const notificationsChannelsOptions = [
  { id: 'schedule', name: 'Lessons' },
  { id: 'actuality', name: 'Actualities changes' },
  { id: 'mail', name: 'New mails' },
  { id: 'bars', name: 'New bars marks' },
];

export const setupNotifications = () => {
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

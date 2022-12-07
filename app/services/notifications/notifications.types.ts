import * as Notifications from 'expo-notifications';

export interface ISendNotificationProps {
  identifier?: string;
  title: string;
  body?: string;
  trigger?: Notifications.NotificationTriggerInput
}

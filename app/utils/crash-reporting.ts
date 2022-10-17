import * as Sentry from 'sentry-expo';
import Config from '@/config';

export const initCrashReporting = () => {
  if (!__DEV__)
    Sentry.init({ dsn: Config.sentryDsn });
};

export const reportCrash = (error: Error) => {
  if (__DEV__) {
    console.error(error);
    console.tron.log(error);
  } else {
    Sentry.Native.captureException(error);
  }
};

export const reportMessage = (message: any) => {
  if (__DEV__) {
    console.info(message);
    console.tron.log(message);
  } else {
    Sentry.Native.captureMessage(message);
  }
};

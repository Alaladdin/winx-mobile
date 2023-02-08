import * as Sentry from 'sentry-expo';
import { SENTRY_DSN } from '@env';

export const routingInstrumentation = new Sentry.Native.ReactNavigationInstrumentation();

export const initCrashReporting = () => {
  Sentry.init({
    dsn                    : SENTRY_DSN,
    enableInExpoDevelopment: true,
    enabled                : !__DEV__,
    tracesSampleRate       : 1.0,
    integrations           : [
      new Sentry.Native.ReactNativeTracing({
        routingInstrumentation,
        traceFetch                : true,
        traceXHR                  : true,
        enableAppStartTracking    : true,
        enableNativeFramesTracking: true,
      }),
    ],
  });
};

export const reportCrash = (error: any) => {
  if (__DEV__)
    console.error(error);
  else
    Sentry.Native.captureException(error);
};

export const
  reportMessage = (message: string, ctx: any) => {
    if (__DEV__)
      console.info(message);
    else
      Sentry.Native.captureMessage(message, { extra: ctx });
  };

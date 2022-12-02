import * as Sentry from 'sentry-expo';
import { SENTRY_DSN } from '@env';

export const initCrashReporting = () => {
  Sentry.init({
    dsn             : SENTRY_DSN,
    // enableInExpoDevelopment: true,
    // debug                  : true,
    tracesSampleRate: 1.0,
    integrations    : [
      new Sentry.Native.ReactNativeTracing({
        routingInstrumentation    : new Sentry.Native.ReactNavigationInstrumentation(),
        tracingOrigins            : ['localhost', /^https:\/\//, /^\//],
        traceFetch                : true,
        traceXHR                  : true,
        enableAppStartTracking    : true,
        enableStallTracking       : true,
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

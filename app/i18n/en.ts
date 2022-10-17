const en = {
  common: {
    ok    : 'OK!',
    cancel: 'Cancel',
    back  : 'Back',
  },
  mainNavigator: {
    scheduleTab : 'Schedule',
    actualityTab: 'Actuality',
    barsTab     : 'Bars',
    mailTab     : 'Mail',
    settingsTab : 'Settings',
  },
  errorScreen: {
    title           : 'Something went wrong!',
    friendlySubtitle: "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset           : 'RESET APP',
    traceTitle      : 'Error from %{name} stack', // @demo remove-current-line
  },
};

export default en;
export type Translations = typeof en

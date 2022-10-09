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
    settingsTab : 'Settings',
  },
  errorScreen: {
    title           : 'Something went wrong!',
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset     : 'RESET APP',
    traceTitle: 'Error from %{name} stack', // @demo remove-current-line
  },
  emptyStateComponent: {
    generic: {
      heading: 'So empty... so sad',
      content: 'No data found yet. Try clicking the button to refresh or reload the app.',
      button : "Let's try this again",
    },
  },
};

export default en;
export type Translations = typeof en

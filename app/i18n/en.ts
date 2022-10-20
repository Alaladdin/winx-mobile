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
  emptyStateComponent: {
    generic: {
      heading: 'So empty... so sad',
      content: 'No data found yet. Try clicking the button to refresh or reload the app.',
      button : "Let's try this again",
    },
  },
  errorScreen: {
    title           : 'Something went wrong!',
    friendlySubtitle: 'Wooops. So sorry',
    reset           : 'RESET APP',
  },
};

export default en;
export type Translations = typeof en

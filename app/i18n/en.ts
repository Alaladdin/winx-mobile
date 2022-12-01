const en = {
  common: {
    ok     : 'OK!',
    confirm: 'Yes. Do it!',
    cancel : 'Cancel',
    back   : 'Back',
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
      heading: 'So empty... so lonely',
      content: 'No data found. Try clicking the button to refresh',
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

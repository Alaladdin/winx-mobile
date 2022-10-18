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
    friendlySubtitle: 'Wooops. So sorry',
    reset           : 'RESET APP',
    traceTitle      : 'Error from %{name} stack', // @demo remove-current-line
  },
};

export default en;
export type Translations = typeof en

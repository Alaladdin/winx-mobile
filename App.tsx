import { StatusBar, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import * as Sentry from 'sentry-expo';
import React, { useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MainNavigator } from './app/navigators';
import theme from './app/theme';
import Config from './app/config';
import { ErrorBoundary } from './app/screens';
import { initCrashReporting, reportCrash } from './app/utils/crash-reporting';
import { Header } from './app/components';
import { useInitialRootStore, RootStoreProvider } from './app/models';
import { setupReactotron } from './app/services/reactotron';

setupReactotron({
  clearOnLoad    : true,
  host           : 'localhost',
  useAsyncStorage: true,
  logInitialState: true,
  logSnapshots   : false,
});

SplashScreen.preventAutoHideAsync();

const init = () => {
  initCrashReporting();
  library.add(fas);
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge : false,
    }),
  });
};

function App() {
  const [settingsBadges, setSettingsBadges] = useState<number>(null);
  init();

  const { rootStore, rehydrated } = useInitialRootStore(() => {
    SplashScreen.hideAsync();
  });

  if (!__DEV__) {
    Updates.checkForUpdateAsync()
      .then((result: Updates.UpdateCheckResult) => {
        const { isAvailable } = result;
        rootStore.mainStore.setHasUpdate(isAvailable);
        if (isAvailable)
          setSettingsBadges(1);
      })
      .catch((e) => {
        reportCrash(e);
      });
  }

  if (!rehydrated) return null;

  return (
    <RootStoreProvider value={ rootStore }>
      <GestureHandlerRootView style={ styles.screen }>
        <PaperProvider theme={ theme }>
          <StatusBar
            barStyle="light-content"
            backgroundColor={ styles.statusBar.backgroundColor }
          />

          <ErrorBoundary catchErrors={ Config.catchErrors }>
            <Header />
            <MainNavigator badges={ { settings: settingsBadges } } />
          </ErrorBoundary>
        </PaperProvider>
      </GestureHandlerRootView>
    </RootStoreProvider>
  );
}

export default Sentry.Native.wrap(App);

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: '#2a2831',
  },
  screen: {
    height: '100%',
  },
});

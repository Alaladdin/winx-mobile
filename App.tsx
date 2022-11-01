import { StatusBar, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as Analytics from 'expo-firebase-analytics';

import { MainNavigator } from '@/navigators';
import theme from '@/theme';
import Config from '@/config';
import { ErrorBoundary } from '@/screens';
import { reportCrash } from '@/utils/crash-reporting';
import { Header } from '@/components';
import { useInitialRootStore, RootStoreProvider } from '@/models';
import { setupReactotron } from '@/services/reactotron';

setupReactotron({
  clearOnLoad    : true,
  host           : 'localhost',
  useAsyncStorage: true,
  logInitialState: true,
  logSnapshots   : false,
});

SplashScreen.preventAutoHideAsync();

const init = () => {
  library.add(fas);
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge : false,
    }),
  });
};

export default function App() {
  const prefix = Linking.createURL('/');
  const linking = { prefixes: [prefix, 'https://winx.mpei.space'] };
  const [settingsBadges, setSettingsBadges] = useState<number>(null);

  init();

  const { rootStore, rehydrated } = useInitialRootStore(() => {
    SplashScreen.hideAsync();
  });

  useEffect(() => {
    if (!__DEV__) {
      Updates.checkForUpdateAsync()
        .then((result: Updates.UpdateCheckResult) => {
          const { isAvailable } = result;

          rootStore.mainStore.setHasUpdate(isAvailable);

          if (isAvailable)
            setSettingsBadges(1);
        })
        .catch(reportCrash);
    }
  }, []);

  const trackScreen = useCallback((state: NavigationState) => {
    if (state) {
      const { routeNames, index } = state;
      const routeName = routeNames[index];

      if (routeName)
        Analytics.logEvent('screen_view', { screen: routeName });
    }
  }, []);

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
            <NavigationContainer linking={ linking } theme={ theme } onStateChange={ trackScreen }>
              <Header />
              <MainNavigator badges={ { settings: settingsBadges } } />
            </NavigationContainer>
          </ErrorBoundary>
        </PaperProvider>
      </GestureHandlerRootView>
    </RootStoreProvider>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: theme.colors.elevation.level0,
  },
  screen: {
    height: '100%',
  },
});

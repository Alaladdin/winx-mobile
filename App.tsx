import { StatusBar, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { QueryClient } from '@tanstack/react-query';
import * as Analytics from 'expo-firebase-analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { MainNavigator } from '@/navigators';
import theme from '@/theme';
import Config from '@/config';
import { ErrorBoundary } from '@/screens';
import { RootStoreProvider, useInitialRootStore } from '@/models';
import { setupReactotron } from '@/services/reactotron';
import 'expo-dev-client';

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

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function App() {
  const prefix = Linking.createURL('/');
  const linking = { prefixes: [prefix, 'https://winx.mpei.space'] };
  const hour = 1000 * 60 * 60;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: hour * 24 * 3,
        staleTime: hour * 3,
      },
    },
  });

  init();

  const { rootStore, rehydrated } = useInitialRootStore(() => {
    SplashScreen.hideAsync();

    if (rootStore.authStore.user.token)
      rootStore.authStore.loadUser();
  });

  useEffect(() => {
    const baseOptions = { importance: AndroidImportance.DEFAULT, enableVibrate: true };

    Notifications.setNotificationChannelAsync('schedule', { ...baseOptions, name: 'Lessons' });
    Notifications.setNotificationChannelAsync('actuality', { ...baseOptions, name: 'Actuality changes' });
    Notifications.setNotificationChannelAsync('mail', { ...baseOptions, name: 'New mails' });
    Notifications.setNotificationChannelAsync('bars', { ...baseOptions, name: 'New bars marks' });
  });

  const trackScreen = useCallback((state: NavigationState) => {
    const { routeNames, index } = state;

    Analytics.logEvent('screen_view', { screen: routeNames[index] });
  }, []);

  if (!rehydrated) return null;

  return (
    <PersistQueryClientProvider
      client={ queryClient }
      persistOptions={ { persister: asyncStoragePersister } }
    >
      <RootStoreProvider value={ rootStore }>
        <GestureHandlerRootView style={ styles.screen }>
          <PaperProvider theme={ theme }>
            <StatusBar
              barStyle="light-content"
              backgroundColor={ styles.statusBar.backgroundColor }
            />

            <ErrorBoundary catchErrors={ Config.catchErrors }>
              <NavigationContainer
                linking={ linking }
                theme={ theme }
                onStateChange={ trackScreen }
              >
                <MainNavigator />
              </NavigationContainer>
            </ErrorBoundary>
          </PaperProvider>
        </GestureHandlerRootView>
      </RootStoreProvider>
    </PersistQueryClientProvider>
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

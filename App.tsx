import { StatusBar, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { observer } from 'mobx-react';
import * as Sentry from 'sentry-expo';
import { useCallback } from 'react';
import noop from 'lodash/noop';
import { MainNavigator } from '@/navigators';
import theme from '@/theme';
import Config from '@/config';
import { ErrorBoundary } from '@/screens';
import { RootStoreProvider, useInitialRootStore } from '@/models';
import 'expo-dev-client';
import '@/utils/ignore-warnings';
import { setupIcons, setupReactQuery } from '@/setup';
import { initNotifications } from '@/services/notifications';
import { SnackBar } from '@/components';
import { initCrashReporting, routingInstrumentation } from '@/utils/crash-reporting';
import { checkAppUpdates } from '@/services/updates';

SplashScreen.preventAutoHideAsync();

initNotifications();

const App = observer(() => {
  initCrashReporting();
  setupIcons();

  const navigationRef = createNavigationContainerRef();
  const { queryClient, persisterStorage } = setupReactQuery();
  const { rootStore, rehydrated } = useInitialRootStore(() => {
    const { authStore } = rootStore;

    if (authStore.user.token)
      authStore.loadUser();

    checkAppUpdates()
      .then((result) => {
        rootStore.mainStore.setHasUpdate(result.isAvailable);
      })
      .catch(noop);
  });

  const onNavigationReady = useCallback(() => {
    SplashScreen.hideAsync();
    routingInstrumentation.registerNavigationContainer(navigationRef);
  }, [navigationRef]);

  if (!rehydrated) return null;

  return (
    <PersistQueryClientProvider
      client={ queryClient }
      persistOptions={ { persister: persisterStorage } }
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
                ref={ navigationRef }
                theme={ theme }
                onReady={ onNavigationReady }
              >
                <MainNavigator />
              </NavigationContainer>
              <SnackBar
                style={ styles.snackBar }
                { ...rootStore.mainStore.snackBarOptions }
                onDismiss={ rootStore.mainStore.hideSnackBar }
              />
            </ErrorBoundary>
          </PaperProvider>
        </GestureHandlerRootView>
      </RootStoreProvider>
    </PersistQueryClientProvider>
  );
});

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: theme.colors.elevation.level0,
  },
  screen: {
    height: '100%',
  },
  snackBar: {
    marginBottom: 90,
  },
});

export default Sentry.Native.wrap(App);

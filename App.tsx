import { StatusBar, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { observer } from 'mobx-react';
import { MainNavigator } from '@/navigators';
import theme from '@/theme';
import Config from '@/config';
import { ErrorBoundary } from '@/screens';
import { RootStoreProvider, useInitialRootStore } from '@/models';
import { setupReactotron } from '@/services/reactotron';
import 'expo-dev-client';
import '@/utils/ignore-warnings';
import { setupIcons, setupNotifications, setupReactQuery } from '@/setup';
import { SnackBar } from '@/components';

setupReactotron({
  clearOnLoad    : true,
  host           : 'localhost',
  useAsyncStorage: true,
  logInitialState: true,
  logSnapshots   : false,
});

SplashScreen.preventAutoHideAsync();

export default observer(() => {
  setupIcons();
  setupNotifications();

  const { queryClient, persisterStorage } = setupReactQuery();
  const { rootStore, rehydrated } = useInitialRootStore(() => {
    const { authStore } = rootStore;

    if (authStore.user.token)
      authStore.loadUser();
  });

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
              <NavigationContainer theme={ theme } onReady={ SplashScreen.hideAsync }>
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

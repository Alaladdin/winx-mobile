import { StatusBar, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { MainNavigator } from './app/navigators';
import theme from './app/theme';
import Config from './app/config';
import { ErrorBoundary } from './app/screens';

export default function App() {
  library.add(fas);

  return (
    <PaperProvider theme={ theme }>
      <ErrorBoundary catchErrors={ Config.catchErrors }>
        <StatusBar barStyle="light-content" backgroundColor={ theme.colors.background } />
        <View style={ styles.container }>
          <MainNavigator />
        </View>
      </ErrorBoundary>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});

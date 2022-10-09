import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { MainNavigator } from './app/navigators';
import theme from './app/theme';

export default function App() {
  library.add(fas);

  return (
    <SafeAreaView style={ styles.container }>
      <StatusBar barStyle="light-content" backgroundColor={ theme.colors.background } />
      <PaperProvider theme={ theme }>
        <MainNavigator />
      </PaperProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});

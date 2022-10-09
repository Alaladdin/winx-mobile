import { StatusBar, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { MainNavigator } from './app/navigators';
import theme from './app/theme';

export default function App() {
  library.add(fas);

  return (
    <PaperProvider theme={ theme }>
      <StatusBar barStyle="light-content" backgroundColor={ theme.colors.background } />
      <View style={ styles.container }>
        <MainNavigator />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});

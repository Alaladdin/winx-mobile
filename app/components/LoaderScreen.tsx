import { ProgressBar } from 'react-native-paper';
import { Image, StyleSheet, View } from 'react-native';

export function LoaderScreen() {
  return (
    <View style={ styles.container }>
      <ProgressBar progress={ 0.5 } indeterminate />
      <Image style={ styles.image } source={ require('../../assets/gifs/lazy_cat_spinning.gif') } />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width     : '100%',
    height    : '100%',
  },
  image: {
    width     : '100%',
    resizeMode: 'contain',
  },
});

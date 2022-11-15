import { Image, StyleSheet, View } from 'react-native';
import { random } from 'lodash';

const images = [
  require('../../assets/gifs/lazy_cat_full.gif'),
  require('../../assets/gifs/lazy_cat_licking.gif'),
  require('../../assets/gifs/lazy_cat_sleeping.gif'),
  require('../../assets/gifs/lazy_cat_spinning.gif'),
  require('../../assets/gifs/lazy_cat_with_fishes.gif'),
  require('../../assets/gifs/lazy_cat_in_hands.gif'),
];

export function LoaderScreen() {
  return (
    <View style={ styles.container }>
      <Image style={ styles.image } source={ images[random(images.length - 1)] } />
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

import { Image, StyleSheet, View } from 'react-native';
import { Button, ButtonProps, Text } from 'react-native-paper';
import { translate } from '@/i18n';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageSource = require('../../assets/gifs/lazy_cat_sleeping.gif');

interface IEmptyStateProps {
  buttonProps?: Omit<ButtonProps, 'children' | 'theme'>;
}

export function EmptyState({ buttonProps }: IEmptyStateProps) {
  const headTitle = translate('emptyStateComponent.generic.heading');
  const bodyText = translate('emptyStateComponent.generic.content');

  return (
    <View style={ styles.container }>
      <Text variant="headlineSmall">
        { headTitle}
      </Text>

      <Image source={ imageSource } style={ styles.image } />

      {
        buttonProps && (
        <>
          <Text variant="titleSmall" style={ styles.bodyText }>
            { bodyText }
          </Text>

          <Button
            style={ styles.button }
            mode="contained-tonal"
            { ...buttonProps }
          >
            { translate('emptyStateComponent.generic.button') }
          </Button>
        </>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding       : 20,
    alignItems    : 'center',
    justifyContent: 'center',
    width         : '100%',
    height        : '100%',
  },
  bodyText: {
    textAlign: 'center',
  },
  image: {
    height    : 300,
    resizeMode: 'contain',
  },
  button: {
    marginTop: 20,
  },
});

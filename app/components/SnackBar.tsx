import { Text, Snackbar } from 'react-native-paper';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useMemo } from 'react';
import theme from '@/theme';
import { Icon } from '@/components/Icon';

type SnackBarVariant = 'info' | 'success' | 'warning' | 'error'

export interface ISnackBarProps {
  style?: ViewStyle;
  text: string;
  variant?: string | SnackBarVariant;
  onDismiss: () => void;
}

export function SnackBar({ style, text, variant, onDismiss }: ISnackBarProps) {
  const iconName = useMemo(() => {
    if (variant === 'success')
      return 'check-circle';

    if (variant === 'warning')
      return 'circle-exclamation';

    if (variant === 'error')
      return 'triangle-exclamation';

    return 'info-circle';
  }, [variant]);

  return (
    <Snackbar
      style={ [styles.container, style] }
      duration={ 3000 }
      visible={ !!text }
      onDismiss={ onDismiss }
    >
      <View style={ styles.contentContainer }>
        <Icon icon={ iconName } style={ { marginRight: 10 } } />
        <Text>{ text }</Text>
      </View>
    </Snackbar>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.elevation.level2,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems   : 'center',
  },
});

import { Surface, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import theme from '@/theme';

export function ScheduleEmptyItem() {
  return (
    <Surface style={ styles.cardEmpty }>
      <Text style={ styles.cardTextColor }>no lessons</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  cardEmpty: {
    justifyContent: 'center',
    alignItems    : 'center',
    marginBottom  : theme.spacing.extraLarge,
    borderRadius  : 20,
    borderStyle   : 'dashed',
    borderColor   : theme.colors.neutralVariant50,
    borderWidth   : 1,
    height        : 135,
    overflow      : 'hidden',
  },
  cardTextColor: {
    color: theme.colors.neutralVariant50,
  },
});

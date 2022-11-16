import { Text } from 'react-native-paper';
import { StyleSheet, TextStyle } from 'react-native';
import { useMemo } from 'react';
import theme from '@/theme';

export function BarsMark({ mark }) {
  const markStyles = useMemo(() => {
    const stylesList: TextStyle[] = [styles.markItem];

    if (mark !== '⋆')
      stylesList.push(styles.bgRed);

    if (mark === 4)
      stylesList.push(styles.bgYellow);

    if (mark === 5)
      stylesList.push(styles.bgGreen);

    return stylesList;
  }, [mark]);

  return (
    <Text style={ markStyles }>
      { mark }
    </Text>
  );
}

const styles = StyleSheet.create({
  markItem: {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    marginRight      : theme.spacing.tiny,
    paddingHorizontal: theme.spacing.extraSmall,
    paddingVertical  : theme.spacing.tiny,
    borderRadius     : theme.roundness,
    backgroundColor  : theme.colors.elevation.level4,
  },
  bgRed: {
    backgroundColor: theme.colors.rose[500],
  },
  bgGreen: {
    backgroundColor: theme.colors.green[500],
  },
  bgYellow: {
    backgroundColor: theme.colors.orange[400],
  },
});

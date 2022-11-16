import { Surface, Text } from 'react-native-paper';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useMemo } from 'react';
import theme from '@/theme';
import { IScheduleItem } from '@/screens/ScheduleScreen/IScheduleItem';

interface ScheduleItemProps {
  schedule: IScheduleItem;
  disabled?: boolean;
}

export function ScheduleItem({ schedule, disabled }: ScheduleItemProps) {
  const cardHeaderStyles = useMemo(() => {
    const stylesList: ViewStyle[] = [styles.cardHeader, styles.bgRed];

    if (schedule.kindOfWorkId === 31)
      stylesList.push(styles.bgYellow);

    if (schedule.kindOfWorkId === 42)
      stylesList.push(styles.bgGreen);

    return stylesList;
  }, [schedule.kindOfWorkId]);

  return (
    <View style={ [disabled && styles.cardDisabled] }>
      <View style={ styles.cardBefore }>
        <Text variant="titleSmall">
          { `${schedule.beginLesson} – ${schedule.endLesson}` }
        </Text>
      </View>

      <Surface style={ styles.card }>
        <View style={ cardHeaderStyles }>
          <Text variant="labelLarge">{ schedule.dayOfWeekString }</Text>
          <Text variant="labelLarge">{ schedule.kindOfWork }</Text>
          <Text variant="labelLarge">{ schedule.date }</Text>
        </View>

        <View style={ styles.cardBody }>
          <Text style={ { marginBottom: 10 } } variant="labelLarge">{ schedule.discipline }</Text>
          <View style={ { flexDirection: 'row', alignItems: 'center', width: '100%' } }>
            <Text style={ styles.cardBadge }>{ schedule.auditorium }</Text>
            <Text style={ { color: theme.colors.onSurfaceDisabled, marginRight: 'auto' } }>{ schedule.lecturer }</Text>
          </View>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  cardDisabled: {
    opacity: 0.4,
  },
  cardBefore: {
    marginBottom: theme.spacing.extraSmall,
  },
  card: {
    marginBottom: theme.spacing.extraLarge,
    borderRadius: 20,
    overflow    : 'hidden',
  },
  cardHeader: {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    paddingVertical  : 10,
    paddingHorizontal: 20,
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
  cardBody: {
    paddingVertical  : 15,
    paddingHorizontal: 20,
    alignItems       : 'center',
  },
  cardBadge: {
    marginRight    : 'auto',
    padding        : 10,
    borderRadius   : 15,
    fontSize       : 10,
    backgroundColor: theme.colors.neutralVariant30,
  },
});

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { groupBy, map } from 'lodash';
import moment from 'moment';
import PagerView from 'react-native-pager-view';
import { api } from '../services/api';
import config from '../config';
import theme from '../theme';
import { LoaderScreen } from '../components';

interface IScheduleItem {
  auditorium: string
  beginLesson: string,
  building: string,
  date: string,
  dayOfWeekString: string,
  discipline: string,
  disciplineAbbr: string,
  endLesson: string,
  group: null | string,
  kindOfWork: string,
  kindOfWorkId: number,
  lecturer: string,
}

const getDatesRanges = () => {
  const start = moment().startOf('isoWeek').format(config.serverDateFormat);
  const end = moment().add(2, 'months').endOf('isoWeek').format(config.serverDateFormat);

  return [start, end];
};

const todayCompare = moment().format(config.serverDateFormat);
const isDayBeforeToday = (one) => todayCompare > moment(one, config.defaultDateFormat).format(config.serverDateFormat);

const renderSchedule = (schedule: IScheduleItem, key) => (
  <View key={ key } style={ [isDayBeforeToday(schedule.date) && styles.cardDisabled] }>
    <View style={ styles.cardBefore }>
      <Text variant="titleSmall">
        { `${schedule.beginLesson} – ${schedule.endLesson}` }
      </Text>
    </View>

    <Surface style={ styles.card }>
      <View style={ [
        styles.cardHeader,
        styles.cardRed,
        schedule.kindOfWorkId === 31 && styles.cardYellow,
        schedule.kindOfWorkId === 42 && styles.cardGreen,
      ] }
      >
        <Text variant="labelLarge">{ schedule.dayOfWeekString }</Text>
        <Text variant="labelLarge">{ schedule.kindOfWork }</Text>
        <Text variant="labelLarge">{ schedule.date }</Text>
      </View>

      <View style={ styles.cardContainer }>
        <View style={ { alignItems: 'center', width: '100%' } }>
          <Text style={ { marginBottom: 10 } } variant="labelLarge">{ schedule.discipline }</Text>
          <View style={ { flexDirection: 'row', alignItems: 'center', width: '100%' } }>
            <Text style={ styles.cardBadge }>{ schedule.auditorium }</Text>
            <Text style={ { color: theme.colors.onSurfaceDisabled, marginRight: 'auto' } }>{ schedule.lecturer }</Text>
          </View>
        </View>
      </View>
    </Surface>
  </View>
);

export function ScheduleScreen(): JSX.Element {
  const [start, finish] = getDatesRanges();
  const [schedules, setSchedule] = useState(null);
  const [isLoading, setLoading] = useState(false);

  if (schedules === null && !isLoading) {
    setLoading(true);
    api.get('/getSchedule', { start, finish })
      .then((data) => {
        setSchedule(
          groupBy(data.schedule, ({ date }: IScheduleItem) => moment(date, 'DD.MM').startOf('isoWeek').format('DD_MM'))
        );
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 1000);
      });
  }

  if (isLoading || !schedules)
    return <LoaderScreen />;

  const views = map(schedules, (weeklySchedules, index) => (
    <ScrollView contentContainerStyle={ { padding: 20 } } key={ index }>
      { map(weeklySchedules, renderSchedule) }
    </ScrollView>
  ));

  return (
    <PagerView
      style={ styles.container }
      pageMargin={ 20 }
      scrollEnabled
    >
      { views }
    </PagerView>
  );
}

const styles = StyleSheet.create({
  container: {
    width : '100%',
    height: '93%', // todo fix
  },
  cardBefore: {
    marginBottom: 10,
  },
  card: {
    marginBottom: 30,
    borderRadius: 20,
    overflow    : 'hidden',
  },
  cardDisabled: {
    opacity: 0.4,
  },
  cardHeader: {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    paddingVertical  : 10,
    paddingHorizontal: 20,
  },
  cardRed: {
    backgroundColor: theme.colors.rose[500],
  },
  cardGreen: {
    backgroundColor: theme.colors.green[500],
  },
  cardYellow: {
    backgroundColor: theme.colors.orange[400],
  },
  cardContainer: {
    paddingVertical  : 15,
    paddingHorizontal: 20,
    flexDirection    : 'row',
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

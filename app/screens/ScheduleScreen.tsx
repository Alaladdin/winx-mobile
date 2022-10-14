import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, ActivityIndicator, Divider, Surface, Title } from 'react-native-paper';
import { groupBy, map } from 'lodash';
import moment from 'moment';
import PagerView from 'react-native-pager-view';
import { api } from '../services/api';
import config from '../config';
import theme from '../theme';

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
  lecturer: string,
}

const getDatesRanges = () => {
  const start = moment().startOf('isoWeek').format(config.serverDateFormat);
  const end = moment().add(2, 'months').endOf('isoWeek').format(config.serverDateFormat);

  return [start, end];
};

const today = moment().format(config.defaultDateFormat);
const todayCompare = moment().format(config.serverDateFormat);
const isDayBeforeToday = (one) => todayCompare > moment(one, config.defaultDateFormat).format(config.serverDateFormat);

const renderSchedule = (schedule: IScheduleItem, key) => (
  <Surface
    key={ key }
    style={ [
      styles.card,
      (today === schedule.date && styles.cardActive),
      (isDayBeforeToday(schedule.date) && styles.cardDisabled),
    ] }
  >
    <View style={ styles.titleContainer }>
      <View style={ { display: 'flex', flexDirection: 'row' } }>
        <Text style={ styles.cardBadge }>{ schedule.dayOfWeekString }</Text>
        <Title>{ schedule.disciplineAbbr }</Title>
      </View>
      <Text>{ schedule.date }</Text>
    </View>
    <Divider />
    <Text>{ schedule.kindOfWork }</Text>
    <Text>{ schedule.auditorium }</Text>
  </Surface>
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
        setLoading(false);
      });
  }

  if (isLoading || !schedules)
    return <ActivityIndicator animating />;

  const views = map(schedules, (weeklySchedules, index) => (
    <ScrollView key={ index }>
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
  card: {
    padding     : 20,
    marginBottom: 20,
  },
  cardDisabled: {
    opacity: 0.4,
  },
  cardActive: {
    backgroundColor: theme.colors.purple[500],
  },
  titleContainer: {
    display       : 'flex',
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems    : 'center',
  },
  cardBadge: {
    paddingVertical: 5,
    marginBottom   : 10,
    marginRight    : 20,
    display        : 'flex',
    justifyContent : 'center',
    alignItems     : 'center',
    textAlign      : 'center',
    borderStyle    : 'solid',
    borderWidth    : 1,
    borderRadius   : 4,
    borderColor    : theme.colors.onBackground,
    width          : 45,
  },
});

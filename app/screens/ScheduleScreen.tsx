import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, ActivityIndicator, Card, Title } from 'react-native-paper';
import { findIndex, groupBy, keys, map } from 'lodash';
import moment from 'moment';
import PagerView from 'react-native-pager-view';
import { api } from '../services/api';
import config from '../config';

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
  const offset = 20;
  const start = moment().subtract(offset, 'days').format(config.serverDateFormat);
  const end = moment().add(offset, 'days').format(config.serverDateFormat);

  return [start, end];
};

const renderSchedule = (schedule: IScheduleItem, key) => (
  <Card key={ key }>
    <Card.Title
      title={ schedule.disciplineAbbr }
      left={ () => <Title>{ schedule.dayOfWeekString.toUpperCase() }</Title> }
      right={ () => <Text>{ schedule.date }</Text> }
    />
    <Card.Content>
      <Text>{ schedule.kindOfWork }</Text>
      <Text>{ schedule.auditorium }</Text>
    </Card.Content>
  </Card>
);

export function ScheduleScreen() {
  const [start, finish] = getDatesRanges();
  const [schedules, setSchedule] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const currentWeekStartDay = moment().add(2, 'days').startOf('isoWeek').format('DD_MM');

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
    <View key={ index }>
      { map(weeklySchedules, renderSchedule) }
    </View>
  ));

  const initialIndex = findIndex(keys(schedules), (key) => key === currentWeekStartDay);

  return (
    <PagerView
      style={ styles.pagerView }
      initialPage={ initialIndex }
      scrollEnabled
    >
      { views }
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    width : '100%',
    height: '100%',
  },
});

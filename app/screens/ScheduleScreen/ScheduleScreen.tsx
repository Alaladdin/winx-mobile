import { useEffect, useMemo, useRef } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { each, groupBy, map, some } from 'lodash';
import moment from 'moment';
import PagerView from 'react-native-pager-view';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import config from '@/config';
import theme from '@/theme';
import { Loader } from '@/components';
import { IScheduleItem } from './IScheduleItem';
import { EmptyState } from '@/components/EmptyState';

const loaderScreen = <Loader />;
const todayCompare = moment().format(config.serverDateFormat);
const isDayBeforeToday = (one) => todayCompare > moment(one, config.defaultDateFormat).format(config.serverDateFormat);

const renderSchedule = (schedule: IScheduleItem, key) => (
  <View key={ key } style={ [isDayBeforeToday(schedule.date) && styles.cardDisabled] }>
    {
      schedule.isEmpty
        ? (
          <Surface style={ [styles.card, styles.cardEmpty] }>
            <View style={ { justifyContent: 'center', alignItems: 'center', height: '100%' } }>
              <Text style={ { color: theme.colors.neutralVariant50 } }>No lessons</Text>
            </View>
          </Surface>
        ) : (
          <>
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
          </>
        )
   }
  </View>
);

const loadSchedule = () => {
  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт'];
  const start = moment().add(2, 'days').startOf('isoWeek').format(config.serverDateFormat);
  const finish = moment().add(2, 'months').endOf('isoWeek').format(config.serverDateFormat);

  return api.get('/getSchedule', { start, finish })
    .then((data) => {
      const formattedSchedules = map(data.schedule, (i) => ({ ...i, dayOfWeekString: i.dayOfWeekString.toLowerCase() }));
      const groupedSchedules = groupBy(
        formattedSchedules,
        ({ date }) => moment(date, config.defaultDateFormat)
          .startOf('isoWeek')
          .format('MM_DD')
      );

      each(groupedSchedules, (weeklySchedules) => {
        each(weekDays, (weekDay, i) => {
          if (!some(weeklySchedules, { dayOfWeekString: weekDay }))
            weeklySchedules.splice(i, 0, { isEmpty: true });
        });
      });

      return groupedSchedules;
    });
};

export function ScheduleScreen({ navigation }): JSX.Element {
  const pagerViewRef = useRef<PagerView>(null);
  const { data, refetch, isLoading, isRefetching, isError, isRefetchError } = useQuery(['schedule'], loadSchedule);
  const showLoader = useMemo(() => isLoading || isRefetching, [isLoading, isRefetching]);
  const showEmptyState = useMemo(() => !data || isError || isRefetchError, [data, isError, isRefetchError]);

  useEffect(() => navigation.addListener('tabPress', () => {
    pagerViewRef?.current?.setPage(0);
  }), [navigation]);

  if (showLoader)
    return loaderScreen;

  if (showEmptyState)
    return <EmptyState buttonProps={ { onPress: refetch } } />;

  return (
    <PagerView
      ref={ pagerViewRef }
      style={ styles.container }
      pageMargin={ 20 }
      scrollEnabled
    >
      {
        map(data, (weeklySchedules, index) => (
          <ScrollView
            refreshControl={ <RefreshControl refreshing={ isRefetching } onRefresh={ refetch } /> }
            contentContainerStyle={ { padding: 20 } }
            key={ index }
          >
            { map(weeklySchedules, renderSchedule) }
          </ScrollView>
        ))
      }
    </PagerView>
  );
}

const styles = StyleSheet.create({
  container: {
    width : '100%',
    height: '100%',
  },
  cardEmpty: {
    borderStyle : 'dashed',
    borderColor : theme.colors.neutralVariant50,
    borderWidth : 1,
    height      : 135,
    borderRadius: 20,
    marginBottom: 20,
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
  cardOver: {
    height : '100%',
    opacity: 0.5,
    width  : '100%',
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

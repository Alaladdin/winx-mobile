import { useEffect, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { each, groupBy, map, some } from 'lodash';
import moment from 'moment';
import PagerView from 'react-native-pager-view';
import { useQuery } from '@tanstack/react-query';
import config from '@/config';
import { Loader, EmptyState } from '@/components';
import { IScheduleItem } from './IScheduleItem';
import { useRequest, IRequestConfig } from '@/hooks/useRequest';
import { ScheduleEmptyItem } from '@/screens/ScheduleScreen/ScheduleEmptyItem';
import { ScheduleItem } from '@/screens/ScheduleScreen/ScheduleItem';

const loaderScreen = <Loader />;
const todayCompare = moment().format(config.serverDateFormat);
const isDayBeforeToday = (date) => todayCompare > moment(date, config.defaultDateFormat).format(config.serverDateFormat);
const renderSchedule = (schedule: IScheduleItem, key) => {
  if (schedule.isEmpty) {
    return (
      <ScheduleEmptyItem key={ key } />
    );
  }

  return (
    <ScheduleItem
      key={ key }
      schedule={ schedule }
      disabled={ isDayBeforeToday(schedule.date) }
    />
  );
};

const formatScheduleData = (data) => {
  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт'];
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
};

const getScheduleRequestOptions = (): IRequestConfig => {
  const start = moment().add(2, 'days').startOf('isoWeek').format(config.serverDateFormat);
  const finish = moment().add(2, 'months').endOf('isoWeek').format(config.serverDateFormat);

  return {
    method    : 'get',
    url       : '/getSchedule',
    params    : { start, finish },
    onResponse: formatScheduleData,
  };
};

export function ScheduleScreen({ navigation }): JSX.Element {
  const pagerViewRef = useRef<PagerView>(null);
  const loadSchedule = useRequest(getScheduleRequestOptions());
  const { data, refetch, isLoading, isRefetching, isError } = useQuery(['schedule'], loadSchedule);
  const showLoader = useMemo(() => isLoading || isRefetching, [isLoading, isRefetching]);
  const showEmptyState = useMemo(() => !data || isError, [data, isError]);
  const refresher = <RefreshControl refreshing={ isRefetching } onRefresh={ refetch } />;

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
            refreshControl={ refresher }
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
});

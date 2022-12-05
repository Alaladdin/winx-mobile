import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { formatDate } from '@/utils/format-date';
import theme from '@/theme';

const loaderScreen = <Loader />;
const todayCompare = formatDate(undefined, config.serverDateFormat);
const isDayBeforeToday = (date) => todayCompare > moment(date, 'DD.MM').format(config.serverDateFormat);
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
    ({ date }) => moment(date, 'DD.MM')
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
  const { data, refetch, isLoading, isError } = useQuery(['schedule'], loadSchedule);
  const showEmptyState = useMemo(() => !data || isError, [data, isError]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => navigation.addListener('tabPress', () => {
    pagerViewRef?.current?.setPage(0);
  }), [navigation]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);

    refetch()
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [refetch]);

  const RefreshControlTag = useMemo(() => (
    <RefreshControl
      refreshing={ isRefreshing }
      onRefresh={ refresh }
    />
  ), [refresh, isRefreshing]);

  if (isLoading)
    return loaderScreen;

  if (showEmptyState)
    return <EmptyState buttonProps={ { onPress: refresh } } />;

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
            key={ index }
            refreshControl={ RefreshControlTag }
            contentContainerStyle={ { padding: theme.spacing.medium } }
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

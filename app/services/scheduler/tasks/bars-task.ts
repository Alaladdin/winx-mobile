import * as BackgroundFetch from 'expo-background-fetch';
import { TaskManagerTaskBody } from 'expo-task-manager';
import { find, differenceWith, isEqual, map } from 'lodash';
import { load } from '@/utils/storage';
import { reportCrash } from '@/utils/crash-reporting';
import { sendNotification } from '@/services/notifications';
import api from '@/services/api';
import { delay } from '@/utils/delay';
import { IBarsMark } from '@/screens/BarsScreen/BarsScreen.types';

const refreshMarks = () => api.post('/bars/user/refreshMarks');
const getBarsUser = () => api.get('/bars/user');
const sleep = () => delay(10 * 1000);

const getBarsCachedData = (): Promise<IBarsMark[]> => load('REACT_QUERY_OFFLINE_CACHE')
  .then((stores) => {
    const barsCache = find(stores.clientState.queries, (query) => query.queryKey.includes('/bars/user'));

    return barsCache.state.data.marks;
  });

export const barsTask = async (body: TaskManagerTaskBody) => {
  const { taskName } = body.executionInfo;

  refreshMarks()
    .then(sleep)
    .then(getBarsUser)
    .then(async (data) => {
      const barsDataCached = await getBarsCachedData();
      const barsData: IBarsMark[] = data.barsUser.marks;
      const changedData = differenceWith(barsData, barsDataCached, isEqual);

      if (changedData.length) {
        const changedDisciplines = map(changedData, 'discipline');

        await sendNotification({
          identifier: taskName,
          title     : 'You have new mark',
          body      : changedDisciplines.join(', '),
        });
      }
    })
    .catch(reportCrash);

  return BackgroundFetch.BackgroundFetchResult.NewData;
};

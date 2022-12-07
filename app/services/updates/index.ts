import * as Updates from 'expo-updates';
import { reportCrash } from '@/utils/crash-reporting';

export const parseUpdateError = (e) => {
  if (e.code === 'ERR_UPDATES_DISABLED')
    return 'Updates disabled';

  if (e.code === 'ERR_UPDATES_RELOAD')
    return 'App reload error';

  if (e.code === 'ERR_UPDATES_CHECK')
    return e.message || 'Updates check error';

  if (e.code === 'ERR_UPDATES_FETCH')
    return e.message || 'Updated fetch error';

  return 'Unknown error';
};

export const checkAppUpdates = async () => {
  if (__DEV__) return { isAvailable: false };

  return Updates.checkForUpdateAsync()
    .catch((err) => {
      reportCrash(err);

      throw parseUpdateError(err);
    });
};

export const updateApp = () => Updates.fetchUpdateAsync()
  .then(Updates.reloadAsync)
  .catch((err) => {
    reportCrash(err);

    throw parseUpdateError(err);
  });

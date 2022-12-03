import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Persister } from '@tanstack/react-query-persist-client';

interface ISetupReactQueryOutput {
  queryClient: QueryClient;
  persisterStorage: Persister;
}

const hour = 1000 * 60 * 60;

export const setupReactQuery = (): ISetupReactQueryOutput => {
  const persisterStorage = createAsyncStoragePersister({ storage: AsyncStorage });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: hour * 24 * 3,
        staleTime: hour * 3,
        retry    : (failureCount, error) => {
          const { kind, temporary } = error || {};

          if (kind && !temporary)
            return false;

          return true;
        },
      },
    },
  });

  return { queryClient, persisterStorage };
};

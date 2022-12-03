import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import api from '@/services/api';
import { IBarsUser } from '@/screens/BarsScreen/BarsScreen.types';
import { getRootStore } from '@/models/helpers/get-root-store';
import { formatDate } from '@/utils/format-date';

const formatBarsUserData = (data) => {
  const { barsUser } = data;

  return {
    ...barsUser,
    updatedAt: formatDate(barsUser.updatedAt, 'HH:mm — DD.MM'),
  };
};

export const BarsStoreModel = types
  .model('BarsStore')
  .actions((store) => ({
    setUser(loginData): Promise<IBarsUser> {
      const { authStore } = getRootStore(store);

      return api.post('/bars/user', loginData)
        .then((data) => {
          authStore.setUser({ barsUser: data.barsUser._id });

          return formatBarsUserData(data);
        });
    },
    loadUser(): Promise<IBarsUser> {
      return api.get('/bars/user')
        .then(formatBarsUserData);
    },
    refreshMarks() {
      return api.post('/bars/user/refreshMarks');
    },
    removeUser() {
      const { authStore } = getRootStore(store);

      return api.delete('/bars/user')
        .then(() => {
          authStore.setUser({ barsUser: null });
        });
    },
  }));

export type BarsStore = Instance<typeof BarsStoreModel>
export type BarsStoreSnapshot = SnapshotOut<typeof BarsStoreModel>

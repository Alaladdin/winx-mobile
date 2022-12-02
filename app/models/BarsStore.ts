import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import moment from 'moment/moment';
import api from '@/services/api';
import { IBarsUser } from '@/screens/BarsScreen/BarsScreen.types';
import { getRootStore } from '@/models/helpers/get-root-store';

const formatBarsUserData = (data) => {
  const { barsUser } = data;

  return {
    ...barsUser,
    updatedAt: moment(barsUser.updatedAt).format('HH:mm — DD.MM'),
  };
};

export const BarsStoreModel = types
  .model('BarsStore')
  .actions((store) => ({
    loadUser() :Promise<IBarsUser> {
      return api.get('/bars/user')
        .then(formatBarsUserData);
    },
    refreshMarks() {
      return api.post('/bars/user/refreshMarks');
    },
    async removeUser() {
      const { authStore } = getRootStore(store);

      return api.delete('/bars/user')
        .then(() => {
          authStore.setUser({ barsUser: null });
        });
    },
  }));

export type BarsStore = Instance<typeof BarsStoreModel>
export type BarsStoreSnapshot = SnapshotOut<typeof BarsStoreModel>

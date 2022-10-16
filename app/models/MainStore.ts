import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const MainStoreModel = types
  .model('MainStore')
  .props({
    _authToken: types.maybe(types.string),
    _hasUpdate: types.optional(types.boolean, false),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store._authToken;
    },
    get hasUpdate() {
      return !!store._hasUpdate;
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store._authToken = value;
    },
    setHasUpdate(value: boolean) {
      store._hasUpdate = !!value;
    },
  }));
export type MainStore = Instance<typeof MainStoreModel>
export type MainStoreSnapshot = SnapshotOut<typeof MainStoreModel>

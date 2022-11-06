import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const MainStoreModel = types
  .model('MainStore')
  .props({
    _hasUpdate: types.optional(types.boolean, false),
  })
  .views((store) => ({
    get hasUpdates() {
      return !!store._hasUpdate;
    },
  }))
  .actions((store) => ({
    setHasUpdate(value: boolean) {
      store._hasUpdate = !!value;
    },
  }));
export type MainStore = Instance<typeof MainStoreModel>
export type MainStoreSnapshot = SnapshotOut<typeof MainStoreModel>

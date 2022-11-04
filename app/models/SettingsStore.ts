import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const SettingsStoreModel = types
  .model('SettingsStore')
  .props({
    _initialRoute: types.optional(types.string, 'schedule'),
  })
  .views((store) => ({
    get initialRoute() {
      return store._initialRoute;
    },
  }))
  .actions((store) => ({
    setInitialRoute(value: string) {
      store._initialRoute = value;
    },
  }));

export type SettingsStore = Instance<typeof SettingsStoreModel>
export type SettingsStoreSnapshot = SnapshotOut<typeof SettingsStoreModel>

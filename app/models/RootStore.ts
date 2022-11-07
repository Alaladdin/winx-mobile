import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { MainStoreModel } from './MainStore';
import { SettingsStoreModel } from './SettingsStore';
import { AuthStoreModel } from './AuthStore';

export const RootStoreModel = types.model('RootStore').props({
  mainStore    : types.optional(MainStoreModel, {}),
  settingsStore: types.optional(SettingsStoreModel, {}),
  authStore    : types.optional(AuthStoreModel, {}),
});

export type RootStore = Instance<typeof RootStoreModel>
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>

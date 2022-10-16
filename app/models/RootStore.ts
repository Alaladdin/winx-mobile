import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { MainStoreModel } from './MainStore';
import { SettingsStoreModel } from './SettingsStore';

export const RootStoreModel = types.model('RootStore').props({
  mainStore    : types.optional(MainStoreModel, {}),
  settingsStore: types.optional(SettingsStoreModel, {}),
});

export type RootStore = Instance<typeof RootStoreModel>
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>

import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { MainStoreModel } from './MainStore';
import { SettingsStoreModel } from './SettingsStore';
import { AuthStoreModel } from './AuthStore';
import { ActualityStoreModel } from './ActualityStore';
import { MailStoreModel } from './MailStore';
import { BarsStoreModel } from './BarsStore';

export const RootStoreModel = types.model('RootStore').props({
  mainStore     : types.optional(MainStoreModel, {}),
  authStore     : types.optional(AuthStoreModel, {}),
  settingsStore : types.optional(SettingsStoreModel, {}),
  actualityStore: types.optional(ActualityStoreModel, {}),
  mailStore     : types.optional(MailStoreModel, {}),
  barsStore     : types.optional(BarsStoreModel, {}),
});

export type RootStore = Instance<typeof RootStoreModel>
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>

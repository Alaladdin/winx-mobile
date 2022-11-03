import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const SettingsStoreModel = types
  .model('SettingsStore')
  .props({
    // _slowDownAnimation: types.optional(types.boolean, false),
  })
  .views((store) => ({
    // get needSlowDownAnimation() {
    //   return !!store._slowDownAnimation;
    // },
  }))
  .actions((store) => ({
    // setSlowDownAnimation(value?: boolean) {
    //   store._slowDownAnimation = value;
    // },
  }));

export type SettingsStore = Instance<typeof SettingsStoreModel>
export type SettingsStoreSnapshot = SnapshotOut<typeof SettingsStoreModel>

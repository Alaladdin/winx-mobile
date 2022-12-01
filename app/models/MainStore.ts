import { Instance, SnapshotOut, types } from 'mobx-state-tree';

const SnackBarOption = types.model('SnackBarOption', {
  text   : types.optional(types.string, ''),
  variant: types.maybeNull(types.string),
});

export const MainStoreModel = types
  .model('MainStore')
  .props({
    _hasUpdate      : types.optional(types.boolean, false),
    _snackBarOptions: types.optional(SnackBarOption, {}),
  })
  .views((store) => ({
    get hasUpdates() {
      return !!store._hasUpdate;
    },
    get snackBarOptions() {
      return store._snackBarOptions;
    },
  }))
  .actions((store) => ({
    setHasUpdate(value: boolean) {
      store._hasUpdate = value;
    },
    setSnackBarOptions(text: string, variant?: string) {
      store._snackBarOptions = { text, variant };
    },
    hideSnackBar() {
      store._snackBarOptions = {
        text   : '',
        variant: null,
      };
    },
  }));
export type MainStore = Instance<typeof MainStoreModel>
export type MainStoreSnapshot = SnapshotOut<typeof MainStoreModel>

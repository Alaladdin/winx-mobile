import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import assign from 'lodash/assign';

const User = types.model('User', {
  token       : types.maybeNull(types.string),
  _id         : types.identifier,
  username    : types.string,
  displayName : types.maybeNull(types.string),
  avatar      : types.maybeNull(types.string),
  barsUser    : types.maybeNull(types.string),
  scope       : types.array(types.string),
  lastLoggedAt: types.maybeNull(types.string),
  lastOnline  : types.maybeNull(types.string),
  createdAt   : types.maybeNull(types.string),
  updatedAt   : types.maybeNull(types.string),
});

export const AuthStoreModel = types
  .model('AuthStore')
  .props({
    _user        : types.maybeNull(User),
    _lastUsername: types.optional(types.string, ''),
  })
  .views((store) => ({
    get user() {
      const currentUser = store._user || { scope: ['guest'] };

      return {
        ...currentUser,
        avatar    : currentUser.avatar || 'avatar/default',
        isAdmin   : currentUser.scope.includes('admin') || currentUser.scope.includes('owner'),
        isOwner   : currentUser.scope.includes('owner'),
        isLoggedIn: !!currentUser._id,
      };
    },
    get lastUsername() {
      return store._lastUsername;
    },
  }))
  .actions((store) => ({
    setUser(user) {
      if (user) {
        store._user = assign({}, store._user, user);
        store._lastUsername = user.username;
      } else {
        store._user = null;
      }
    },
  }));

export type AuthStore = Instance<typeof AuthStoreModel>
export type AuthStoreSnapshot = SnapshotOut<typeof AuthStoreModel>

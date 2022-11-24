import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import assign from 'lodash/assign';
import api from '@/services/api';
import { remove, saveString } from '@/utils/storage';

const User = types.model('User', {
  token       : types.maybeNull(types.string),
  _id         : types.identifier,
  username    : types.string,
  displayName : types.maybeNull(types.string),
  avatar      : types.string,
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
    async setUser(user) {
      if (user) {
        store._user = assign({}, store._user, user);
        store._lastUsername = user.username;
        await saveString('token', `Bearer ${store._user.token}`);
      } else {
        store._user = null;
        await remove('token');
      }
    },
  }))
  .actions((store) => ({
    loadUser() {
      return api.get('/auth/user')
        .then((data) => {
          store.setUser(data.user);

          return data.user;
        })
        .catch((err) => {
          if (err.kind === 'unauthorized')
            store.setUser(null);

          throw err;
        });
    },
    loginUser({ username, password }) {
      return api.post('/auth/login', { username, password })
        .then((data) => {
          store.setUser(data.user);

          return data.user;
        });
    },
    registerUser({ username, password }) {
      return api.post('/auth/register', { username, password })
        .then((data) => {
          store.setUser(data.user);

          return data.user;
        });
    },
    removeUser() {
      return api.delete('/auth/removeUser', { data: { _id: store._user._id } })
        .then((data) => {
          store.setUser(null);
          store._lastUsername = '';

          return data;
        });
    },
  }));

export type AuthStore = Instance<typeof AuthStoreModel>
export type AuthStoreSnapshot = SnapshotOut<typeof AuthStoreModel>

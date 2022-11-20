import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import map from 'lodash/map';
import moment from 'moment/moment';
import api from '@/services/api';

const Updater = types.model('ActualityUpdater', {
  username   : types.string,
  displayName: types.maybeNull(types.string),
  avatar     : types.string,
  scope      : types.array(types.string),
});

const Actuality = types.model('Actuality', {
  _id      : types.identifier,
  name     : types.string,
  data     : types.string,
  updatedAt: types.string,
  updatedBy: types.maybeNull(Updater),
});

const ActualitySection = types.model('ActualitySection', {
  _id        : types.identifier,
  name       : types.string,
  actualities: types.array(Actuality),
});

export const ActualityStoreModel = types
  .model('ActualityStore')
  .props({
    _actualitiesSections: types.optional(types.array(ActualitySection), []),
  })
  .actions((store) => ({
    setActualitiesSections(sections) {
      store._actualitiesSections = sections;
    },
  }))
  .actions((store) => ({
    loadActualitiesSections() {
      return api.get('/getActualitiesSections')
        .then((data) => {
          const sections = map(data.sections, (section) => {
            const actualities = map(section.actualities, (actuality) => ({
              ...actuality,
              updatedBy: {
                ...actuality.updatedBy,
                displayName: actuality.updatedBy?.displayName || actuality.updatedBy.username || 'DELETED',
              },
              updatedAt: moment(actuality.updatedAt).format('DD.mm'),
            }));

            return { ...section, actualities };
          });

          store.setActualitiesSections(sections);

          return sections;
        });
    },
  }));

export type ActualityStore = Instance<typeof ActualityStoreModel>
export type ActualityStoreSnapshot = SnapshotOut<typeof ActualityStoreModel>

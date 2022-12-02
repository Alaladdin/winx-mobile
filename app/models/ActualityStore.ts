import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import map from 'lodash/map';
import api from '@/services/api';
import { formatDate } from '@/utils/format-date';

const Updater = types.model('ActualityUpdater', {
  username   : types.maybeNull(types.string),
  displayName: types.string,
  avatar     : types.string,
  scope      : types.maybeNull(types.array(types.string)),
});

const Actuality = types.model('Actuality', {
  _id      : types.identifier,
  name     : types.string,
  data     : types.string,
  updatedAt: types.string,
  updatedBy: Updater,
});

const ActualitySection = types.model('ActualitySection', {
  _id        : types.identifier,
  name       : types.string,
  actualities: types.array(Actuality),
});

const getFormattedActualtiesSections = (sections) => map(sections, (section) => {
  const actualities = map(section.actualities, (actuality) => {
    const { updatedAt, updatedBy } = actuality;

    return {
      ...actuality,
      updatedAt: formatDate(updatedAt),
      updatedBy: {
        ...updatedBy,
        avatar     : updatedBy?.avatar || 'avatar/error.png',
        displayName: updatedBy?.displayName || updatedBy?.username || 'DELETED',
      },
    };
  });

  return { ...section, actualities };
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
          const sections = getFormattedActualtiesSections(data.sections);

          store.setActualitiesSections(sections);

          return sections;
        });
    },
  }));

export type ActualityStore = Instance<typeof ActualityStoreModel>
export type ActualityStoreSnapshot = SnapshotOut<typeof ActualityStoreModel>

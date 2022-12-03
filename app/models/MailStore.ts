import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import map from 'lodash/map';
import api from '@/services/api';
import { formatDate } from '@/utils/format-date';
import { IMail } from '@/screens/MailScreen/MailScreen.types';

const getFormattedMail = (mail) => map(mail, (item) => ({
  ...item,
  title         : item.title || 'UNTITLED',
  receivedAt    : formatDate(item.receivedAt),
  receivedAtFull: formatDate(item.receivedAt, 'HH:mm - DD.MM.YYYY'),
  attachments   : map(item.attachments, (attach) => ({
    ...attach,
    name: attach.name || 'unknown',
    icon: 'file',
  })),
}));

export const MailStoreModel = types
  .model('MailStore')
  .actions(() => ({
    clearMailCache() {
      return api.delete('/mail');
    },
  }))
  .actions((store) => ({
    loadMail(params): Promise<IMail[]> {
      const requestConfig = { params: { offset: params?.offset } };

      return api.get('/mail', requestConfig)
        .then((data) => getFormattedMail(data.mail));
    },
    toggleRead(mail: IMail) {
      return api.post('/mail/read', { mail })
        .then(store.clearMailCache);
    },
  }));

export type MailStore = Instance<typeof MailStoreModel>
export type MailStoreSnapshot = SnapshotOut<typeof MailStoreModel>

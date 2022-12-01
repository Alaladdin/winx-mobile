import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import map from 'lodash/map';
import api from '@/services/api';
import { formatDateCalendar } from '@/utils/format-date';

const Attachment = types.model('MailAttachment', {
  _id : types.identifier,
  name: types.maybeNull(types.string),
});

const Mail = types.model('Mail', {
  _id        : types.identifier,
  title      : types.maybeNull(types.string),
  body       : types.maybeNull(types.string),
  attachments: types.array(Attachment),
  from       : types.string,
  receivedAt : types.string,
});

export const MailStoreModel = types
  .model('MailStore')
  .props({
    _mail: types.optional(types.array(Mail), []),
  })
  .actions((store) => ({
    setMail(mail) {
      store._mail = mail;
    },
  }))
  .actions((store) => ({
    loadMail() {
      return api.get('/mail')
        .then((data) => {
          const mail = map(data.mail, (item) => ({
            ...item,
            title     : item.title || 'UNTITLED',
            receivedAt: formatDateCalendar(item.receivedAt),
            // attachments: map(item.attachments, (attach) => {
            //   const fileExt = last(attach.name?.split('.'))
            //   const fileIcon = localMetadata.fileIcons[fileExt] || localMetadata.fileIcons.default
            //
            //   return { ...attach, name: attach.name || 'unknown', icon: fileIcon }
            // }),
          }));

          store.setMail(mail);

          return mail;
        });
    },
  }));

export type MailStore = Instance<typeof MailStoreModel>
export type MailStoreSnapshot = SnapshotOut<typeof MailStoreModel>

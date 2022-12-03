import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface IMailAttachment {
  _id: string;
  name: string;
  icon: IconProp; // adds in store
}

export interface IMail {
  _id: string;
  title: string;
  body?: string;
  attachments: IMailAttachment[];
  from: string;
  receivedAt: string;
  receivedAtFull: string; // adds in store
  isRead: boolean;
}

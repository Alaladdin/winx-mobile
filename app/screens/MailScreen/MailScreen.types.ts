export interface IMailAttachment {
  _id: string;
  name: string;
}

export interface IMail {
  _id: string;
  title: string;
  body?: string;
  attachments: IMailAttachment[];
  from: string;
  receivedAt: string;
  isRead: boolean;
}

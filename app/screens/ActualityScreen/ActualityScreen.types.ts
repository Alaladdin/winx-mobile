export interface IActualityUpdater {
  username: string;
  displayName: string | null;
  avatar: string;
  scope: ['user' | 'admin' | 'owner'];
}

export interface IActuality {
  _id: string;
  name: string;
  data: string;
  updatedAt: string;
  updatedBy: IActualityUpdater | null
}

export interface IActualitySection {
  _id: string;
  actualities: [IActuality];
  name: string;
}

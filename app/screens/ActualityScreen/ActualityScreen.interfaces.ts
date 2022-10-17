export interface IActuality {
  _id: string
  name: string
  data: string
  updatedAt: Date
  updatedBy : {
    username: string,
    avatar: null | string,
    scope: ['user' | 'admin' | 'owner'],
    displayName: string
  }
}

export interface IActualitySection {
  _id: string
  actualities: [IActuality]
  name: string
  updatedAt: Date
}

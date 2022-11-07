import { API_URL, AUTH_TOKEN, CLOUDINARY_CLOUD_NAME } from '@env';

export interface ConfigBaseProps {
  persistNavigation: 'always' | 'dev' | 'prod' | 'never'
  catchErrors: 'always' | 'dev' | 'prod' | 'never'
  exitRoutes: string[]
  apiUrl: string
  authToken: string
  avatarBaseUrl: string
  defaultDateFormat: string
  serverDateFormat: string
}

export type PersistNavigationConfig = ConfigBaseProps['persistNavigation']

const BaseConfig: ConfigBaseProps = {
  persistNavigation: 'always',
  catchErrors      : 'prod',
  exitRoutes       : ['Schedule'],
  apiUrl           : API_URL,
  authToken        : AUTH_TOKEN,
  avatarBaseUrl    : `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_webp,q_80,c_fill,r_max,w_1024,h_1024/`,
  defaultDateFormat: 'DD.MM',
  serverDateFormat : 'YYYY.MM.DD',
};

export default BaseConfig;

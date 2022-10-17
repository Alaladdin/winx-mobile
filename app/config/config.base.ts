import { CLOUDINARY_CLOUD_NAME } from '@env';

export interface ConfigBaseProps {
  persistNavigation: 'always' | 'dev' | 'prod' | 'never'
  catchErrors: 'always' | 'dev' | 'prod' | 'never'
  exitRoutes: string[]
  avatarBaseUrl: string
  defaultDateFormat: string
  serverDateFormat: string
}

export type PersistNavigationConfig = ConfigBaseProps['persistNavigation']

const BaseConfig: ConfigBaseProps = {
  persistNavigation: 'always',
  catchErrors      : 'prod',
  exitRoutes       : ['Schedule'],
  avatarBaseUrl    : `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_webp,q_80,c_fill,r_max,w_128,h_128/`,
  defaultDateFormat: 'DD.MM',
  serverDateFormat : 'YYYY.MM.DD',
};

export default BaseConfig;

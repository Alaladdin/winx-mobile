import { version } from './package.json';

const getConfig = () => {
  const IS_DEV = process.env.APP_VARIANT === 'development';
  const IS_BETA = process.env.APP_VARIANT === 'beta';

  if (IS_DEV) {
    return {
      name              : 'MPEIST (dev)',
      icon              : './assets/app-icon-dev.png',
      splash            : './assets/splash-dev.png',
      packageName       : 'com.alaladdin.mpeist.dev',
      googleServicesFile: './conf/google-services.dev.json',
    };
  }

  if (IS_BETA) {
    return {
      name              : 'MPEIST (beta)',
      icon              : './assets/app-icon-beta.png',
      splash            : './assets/splash-beta.png',
      packageName       : 'com.alaladdin.mpeist.beta',
      googleServicesFile: './conf/google-services.beta.json',
    };
  }

  return {
    name              : 'MPEIST',
    icon              : './assets/app-icon.png',
    splash            : './assets/splash.png',
    packageName       : 'com.alaladdin.mpeist',
    googleServicesFile: './conf/google-services.json',
  };
};

const config = getConfig();

export default {
  name           : config.name,
  scheme         : 'mpeist',
  slug           : 'mpeist',
  version,
  orientation    : 'portrait',
  icon           : config.icon,
  backgroundColor: '#2a2831',
  splash         : {
    image          : config.splash,
    resizeMode     : 'contain',
    backgroundColor: '#2a2831',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  platforms          : ['android', 'ios'],
  ios                : {
    bundleIdentifier: config.packageName,
    // googleServicesFile: config.googleServicesFile,
  },
  android: {
    package           : config.packageName,
    googleServicesFile: config.googleServicesFile,
  },
  plugins: [
    'sentry-expo',
    ['expo-notifications', {
      icon : config.icon,
      color: '#ffffff',
    }],
    [
      'expo-build-properties',
      { ios: { useFrameworks: 'static' } },
    ],
  ],
  hooks: {
    postPublish: [
      {
        file  : 'sentry-expo/upload-sourcemaps',
        config: {
          organization: process.env.SENTRY_ORG,
          project     : process.env.SENTRY_PROJECT,
          authToken   : process.env.SENTRY_AUTH_TOKEN,
        },
      },
    ],
  },
  extra: {
    eas: {
      projectId: '6a018905-82b5-4a59-b90d-d9d2cf02c76c',
    },
  },
};

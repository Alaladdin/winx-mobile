import { version } from './package.json';

const getConfig = () => {
  const IS_DEV = process.env.APP_VARIANT === 'development';
  const IS_BETA = process.env.APP_VARIANT === 'beta';

  if (IS_DEV) {
    return {
      name              : 'WINX (Dev)',
      icon              : './assets/app-icon-dev.png',
      splash            : './assets/splash-dev.png',
      packageName       : 'com.alaladdin.winx.dev',
      googleServicesFile: './conf/google-services.dev.json',
    };
  }

  if (IS_BETA) {
    return {
      name              : 'WINX (Beta)',
      icon              : './assets/app-icon-beta.png',
      splash            : './assets/splash-beta.png',
      packageName       : 'com.alaladdin.winx.beta',
      googleServicesFile: './conf/google-services.beta.json',
    };
  }

  return {
    name              : 'WINX',
    icon              : './assets/app-icon.png',
    splash            : './assets/splash.png',
    packageName       : 'com.alaladdin.winx',
    googleServicesFile: './conf/google-services.json',
  };
};

const config = getConfig();

export default {
  name           : config.name,
  scheme         : 'winx',
  slug           : 'winx-mobile',
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
    '@react-native-firebase/app',
    '@react-native-firebase/crashlytics',
    ['expo-notifications', {
      icon : config.icon,
      color: '#ffffff',
    }],
    [
      'expo-build-properties',
      { ios: { useFrameworks: 'static' } },
    ],
  ],
  extra: {
    eas: {
      projectId: 'a9966b77-4fb0-48cd-b472-8df9d317ba42',
    },
  },
};

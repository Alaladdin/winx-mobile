const getConfig = () => {
  const IS_DEV = process.env.APP_VARIANT === 'development';
  const IS_BETA = process.env.APP_VARIANT === 'beta';

  if (IS_DEV) {
    return {
      name          : 'WINX (Dev)',
      icon          : './assets/app-icon-dev.png',
      androidPackage: 'com.alaladdin.winx.dev',
    };
  }

  if (IS_BETA) {
    return {
      name          : 'WINX (Beta)',
      icon          : './assets/app-icon-dev.png',
      androidPackage: 'com.alaladdin.winx.beta',
    };
  }

  return {
    name              : 'WINX',
    icon              : './assets/app-icon.png',
    androidPackage    : 'com.alaladdin.winx',
    googleServicesFile: './google-services.json',
  };
};

const config = getConfig();

export default {
  name              : config.name,
  scheme            : 'winx',
  slug              : 'winx-mobile',
  version           : '2.0.0',
  orientation       : 'portrait',
  icon              : config.icon,
  userInterfaceStyle: 'dark',
  backgroundColor   : '#2a2831',
  splash            : {
    image          : './assets/splash-logo-universal.png',
    resizeMode     : 'contain',
    backgroundColor: '#2a2831',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  platforms          : ['android'],
  ios                : {
    supportsTablet  : true,
    bundleIdentifier: 'com.alaladdin.winx',
  },
  android: {
    package           : config.androidPackage,
    googleServicesFile: config.googleServicesFile,
  },
  plugins: [
    'sentry-expo',
    ['expo-notifications', {
      icon : './assets/app-icon.png',
      color: '#ffffff',
    }],
  ],
  extra: {
    eas: {
      projectId: 'a9966b77-4fb0-48cd-b472-8df9d317ba42',
    },
  },
};

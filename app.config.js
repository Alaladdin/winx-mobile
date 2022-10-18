const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  name              : IS_DEV ? 'WINX (Dev)' : 'WINX',
  slug              : 'winx-mobile',
  version           : '2.0.0',
  orientation       : 'portrait',
  icon              : IS_DEV ? './assets/app-icon-dev.png' : './assets/app-icon.png',
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
    package           : IS_DEV ? 'com.alaladdin.winx.dev' : 'com.alaladdin.winx',
    googleServicesFile: !IS_DEV && './google-services.json',
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

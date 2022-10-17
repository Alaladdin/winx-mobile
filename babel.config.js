module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          // This needs to be mirrored in tsconfig.json
          '@': './app',
        },
      }],
      'module:react-native-dotenv',
      'react-native-reanimated/plugin',
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};

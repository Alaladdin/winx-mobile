import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const isDarkTheme = true;

const commonTheme = {
  spacing: {
    micro     : 2,
    tiny      : 4,
    extraSmall: 8,
    small     : 12,
    medium    : 16,
    large     : 24,
    extraLarge: 32,
    huge      : 48,
    massive   : 64,
  },
};

const darkThemeConfig = {
  ...commonTheme,
  ...MD3DarkTheme,
};

const lightThemeConfig = {
  ...commonTheme,
  ...MD3LightTheme,
};

export default isDarkTheme ? darkThemeConfig : lightThemeConfig;

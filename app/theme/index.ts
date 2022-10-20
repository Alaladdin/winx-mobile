import { MD3DarkTheme, MD3LightTheme, MD3Colors } from 'react-native-paper';
import { merge } from 'lodash';
import { colors } from './colors';

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
  colors: {
    ...MD3Colors,
    ...colors,
  },
};

const darkThemeConfig = merge({}, commonTheme, MD3DarkTheme);
const lightThemeConfig = merge({}, commonTheme, MD3LightTheme);

export default isDarkTheme ? darkThemeConfig : lightThemeConfig;

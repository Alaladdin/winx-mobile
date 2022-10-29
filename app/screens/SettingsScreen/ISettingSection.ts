import { StyleProp, TextStyle } from 'react-native';

export interface ISettingSection {
  headingStyle: StyleProp<TextStyle>;
  setSnackBarMessage?: (string) => void;
}

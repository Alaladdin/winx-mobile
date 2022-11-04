import React, { useMemo, useState } from 'react';
import { List, Text, Switch } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { map, reject } from 'lodash/collection';
import { observer } from 'mobx-react';
import theme from '@/theme';
import { ISettingSection } from './ISettingSection';
import { Select } from '@/components';
import { routesList } from '@/navigators/routes';
import { useStores } from '@/models';

const languageOptions = [
  { value: 'en', title: 'English' },
  { value: 'ru', title: 'Russian' },
];

const InitialRouteSelect = observer(() => {
  const { settingsStore } = useStores();
  const initialPageOptions = useMemo(() => map(
    reject(routesList, { name: 'Settings' }),
    (route) => ({
      title: route.title,
      value: route.name,
      icon : route.icon,
    })
  ), []);

  return (
    <Select
      value={ settingsStore.initialRoute }
      options={ initialPageOptions }
      onChange={ settingsStore.setInitialRoute }
    />
  );
});

const SwitchDisabled = <Switch disabled />;

export function SettingsAppearance({ headingStyle }: ISettingSection) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const LanguageSwitch = useMemo(() => (
    <Select
      value={ currentLanguage }
      options={ languageOptions }
      onChange={ setCurrentLanguage }
      disabled
    />
  ), [currentLanguage]);
  const AccentColorView = useMemo(() => (<View style={ styles.accentColor } />), []);

  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Appearance</Text>

      <List.Item
        title="Language"
        right={ () => LanguageSwitch }
      />

      <List.Item
        title="Dark"
        right={ () => SwitchDisabled }
      />

      <List.Item
        title="Accent color"
        right={ () => AccentColorView }
      />

      <List.Item
        title="Initial page"
        right={ () => <InitialRouteSelect /> }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  accentColor: {
    height         : 15,
    width          : 15,
    borderRadius   : 50,
    backgroundColor: theme.colors.primary,
  },
});

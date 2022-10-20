import React, { useMemo } from 'react';
import { List, Text, Switch } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { map, reject } from 'lodash/collection';
import theme from '@/theme';
import { ISettingSection } from './ISettingSection';
import { useStores } from '@/models';
import { Select } from '@/components';
import { routesList } from '@/navigators/routes';
import { translate } from '@/i18n';

const SlowDownAnimationSwitch = observer(() => {
  const { settingsStore } = useStores();
  const onValueChange = (newVal: boolean) => {
    settingsStore.setSlowDownAnimation(newVal);
  };

  return (
    <Switch
      value={ settingsStore.needSlowDownAnimation }
      onValueChange={ onValueChange }
    />
  );
});

export function SettingsAppearance({ headingStyle }: ISettingSection) {
  const initialPageOptions = useMemo(() => map(reject(routesList, { key: 'settings' }), (route) => ({
    ...route,
    value: route.key,
    title: translate(route.title),
  })), []);

  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Appearance</Text>

      <List.Item
        title="Language"
        right={ () => <Text>English</Text> }
      />

      <List.Item
        title="Slow down loading (better animations)"
        right={ () => (<SlowDownAnimationSwitch />) }
      />

      <List.Item
        title="Dark"
        right={ () => (<Switch value disabled />) }
      />

      <List.Item
        title="Accent color"
        right={ () => (<View style={ styles.accentColor } />) }
      />

      <List.Item
        title="Initial page"
        right={ () => (
          <Select
            value="schedule"
            options={ initialPageOptions }
            disabled
          />
        ) }
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

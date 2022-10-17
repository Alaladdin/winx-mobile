import React from 'react';
import { List, Text, Switch } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import theme from '@/theme';
import { ISettingSection } from './ISettingSection';
import { useStores } from '@/models';

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

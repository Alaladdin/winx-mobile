import React, { useState } from 'react';
import { Button, List, Text } from 'react-native-paper';
import * as Updates from 'expo-updates';
import { ScrollView, StyleSheet } from 'react-native';
import moment from 'moment';
import { Icon, Select } from '../components';
import { reportCrash } from '../utils/crash-reporting';

const channelsOptions = [
  { title: 'release', value: 'default', icon: 'bolt' },
  { title: 'beta', value: 'Beta', icon: 'flask' },
];

export function SettingsScreen() {
  const [channel, setChannel] = useState(Updates.channel || Updates.releaseChannel);
  const [hasUpdates, setHasUpdates] = useState(false);

  const releaseDate = moment(Updates.createdAt).format('HH:mm DD.MM.YY');
  const fetchUpdates = () => {
    setHasUpdates(null);
    return Updates.fetchUpdateAsync()
      .then((result) => {
        setHasUpdates(!result.isNew);
      })
      .catch(() => {
        setHasUpdates(false);
      });
  };

  return (
    <ScrollView style={ styles.container }>
      <Text variant="headlineSmall" style={ styles.heading }>Updates</Text>
      <List.Item
        title="Updates channel"
        right={ () => (
          <Select
            value={ channel }
            options={ channelsOptions }
            onChange={ setChannel }
          />
        ) }
      />
      <List.Item
        title="Release date"
        right={ () => <Text>{ releaseDate }</Text> }
      />

      <List.Item
        title="Check updates"
        right={ () => (
          <Button
            icon={ ({ color }) => <Icon icon="sync" color={ color } size={ 12 } /> }
            disabled={ hasUpdates === null }
            onPress={ fetchUpdates }
          >
            check
          </Button>
        ) }
      />

      <List.Item
        title="Release date"
        right={ () => <Button onPress={ () => reportCrash(new Error('test')) }>Report crash</Button> }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  heading: {
    marginBottom: 15,
    paddingLeft : 15,
  },
});

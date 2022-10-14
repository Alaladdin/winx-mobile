import React, { useEffect, useState } from 'react';
import { Button, List, Text, Snackbar, Switch } from 'react-native-paper';
import * as Updates from 'expo-updates';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import moment from 'moment';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Icon } from '../components';
import { reportCrash } from '../utils/crash-reporting';
import theme from '../theme';
import { version } from '../../package.json';

const parseUpdateError = (e) => {
  if (e.code === 'ERR_UPDATES_DISABLED')
    return 'Updated disabled';

  if (e.code === 'ERR_UPDATES_RELOAD')
    return 'App reload error';

  if (e.code === 'ERR_UPDATES_CHECK')
    return e.message || 'Updates check error';

  if (e.code === 'ERR_UPDATES_FETCH')
    return e.message || 'Updated fetch error';

  return 'Unknown error';
};

export function SettingsScreen() {
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  const [checkButtonText, setCheckButtonText] = useState<string>('check');
  const [checkButtonIcon, setCheckButtonIcon] = useState<IconProp>('sync');
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const closeSnackBar = () => setSnackBarMessage('');

  useEffect(() => {
    let newButtonText = 'check';
    let newButtonIcon = 'sync';

    if (hasUpdates) {
      newButtonText = 'update';
      newButtonIcon = 'download';
    }

    if (isChecking)
      newButtonText = 'checking...';

    if (isUpdating)
      newButtonText = 'updating...';

    setCheckButtonText(newButtonText);
    setCheckButtonIcon(newButtonIcon);
  }, [hasUpdates, isChecking, isUpdating]);

  const releaseDate = moment(Updates.createdAt).format('HH:mm DD.MM');
  const checkUpdates = () => {
    setIsChecking(true);

    Updates.checkForUpdateAsync()
      .then((result) => {
        setHasUpdates(result.isAvailable);

        if (!result.isAvailable)
          setSnackBarMessage('Last version installed already');
      })
      .catch((e) => {
        setSnackBarMessage(parseUpdateError(e));
        reportCrash(e);
      })
      .finally(() => {
        setIsChecking(false);
      });
  };

  const downloadUpdate = () => {
    setIsUpdating(true);

    return Updates.fetchUpdateAsync()
      .then(Updates.reloadAsync)
      .catch((e) => {
        setSnackBarMessage(parseUpdateError(e));
        reportCrash(e);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView>
        <>
          <Text variant="headlineSmall" style={ styles.heading }>Updates</Text>
          <List.Item
            title="Check updates"
            right={ () => (
              <Button
                icon={ ({ color }) => <Icon icon={ checkButtonIcon } color={ color } size={ 12 } /> }
                disabled={ isChecking || isUpdating }
                onPress={ hasUpdates ? downloadUpdate : checkUpdates }
              >
                { checkButtonText }
              </Button>
            ) }
          />

          <List.Item
            title="Release date"
            right={ () => <Text>{ releaseDate }</Text> }
          />
        </>

        <>
          <Text variant="headlineSmall" style={ styles.heading }>Notifications</Text>

          <List.Item
            title="About lessons"
            right={ () => (<Switch value={ false } disabled />) }
          />

          <List.Item
            title="About bars marks change"
            right={ () => (<Switch value={ false } disabled />) }
          />
        </>

        <>
          <Text variant="headlineSmall" style={ styles.heading }>Theme</Text>

          <List.Item
            title="Slow down loading (better animations)"
            right={ () => (<Switch value disabled />) }
          />

          <List.Item
            title="Dark"
            right={ () => (<Switch value disabled />) }
          />

          <List.Item
            title="Accent color"
            right={ () => (<View style={ styles.accentColor } />) }
          />
        </>

        <>
          <Text variant="headlineSmall" style={ styles.heading }>Important</Text>

          <List.Item
            title="Most necessary"
            right={ () => (
              <Button onPress={ () => { setSnackBarMessage('Not yet'); } }>
                Troll Hera
              </Button>
            ) }
          />
        </>

        <View style={ styles.footerContainer }>
          <Text style={ styles.footerText }>
            { `v${version}` }
          </Text>
        </View>

      </ScrollView>
      <Snackbar
        visible={ !!snackBarMessage }
        duration={ 3000 }
        onDismiss={ closeSnackBar }
      >
        { snackBarMessage }
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
  },
  heading: {
    marginTop   : 30,
    marginBottom: 15,
    paddingLeft : 15,
  },
  accentColor: {
    height         : 15,
    width          : 15,
    borderRadius   : 50,
    backgroundColor: theme.colors.primary,
  },
  footerContainer: {
    alignItems: 'center',
    padding   : theme.spacing.medium,
  },
  footerText: {
    color: theme.colors.neutral50,
  },
});

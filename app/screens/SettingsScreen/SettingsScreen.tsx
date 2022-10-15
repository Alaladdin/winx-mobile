import React, { useState } from 'react';
import { Text, Snackbar } from 'react-native-paper';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import theme from '../../theme';
import { version } from '../../../package.json';
import { SettingsDev } from './SettingsDev';
import { SettingsUpdates } from './SettingsUpdates';
import { SettingsAppearance } from './SettingsAppearance';
import { SettingsNotifications } from './SettingsNotifications';

export function SettingsScreen() {
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  const closeSnackBar = () => setSnackBarMessage('');

  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView>
        <SettingsUpdates
          headingStyle={ styles.heading }
          setSnackBarMessage={ setSnackBarMessage }
        />
        <SettingsNotifications headingStyle={ styles.heading } />
        <SettingsAppearance headingStyle={ styles.heading } />
        <SettingsDev headingStyle={ styles.heading } />

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
  footerContainer: {
    alignItems: 'center',
    padding   : theme.spacing.medium,
  },
  footerText: {
    color: theme.colors.neutral50,
  },
});

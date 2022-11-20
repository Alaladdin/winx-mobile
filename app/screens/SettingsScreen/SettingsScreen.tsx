import React, { useState } from 'react';
import { Text, Snackbar, TouchableRipple, Dialog } from 'react-native-paper';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import theme from '@/theme';
import { version } from '@/../package.json';
import { SettingsDev } from './SettingsDev';
import { SettingsUpdates } from './SettingsUpdates';
import { SettingsAppearance } from './SettingsAppearance';
import { SettingsNotifications } from './SettingsNotifications';

export function SettingsScreen() {
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const closeSnackBar = () => setSnackBarMessage('');
  const sectionProps = {
    headingStyle: styles.heading,
    setSnackBarMessage,
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <SettingsNotifications { ...sectionProps } />
        <SettingsAppearance { ...sectionProps } />
        <SettingsUpdates { ...sectionProps } />

        <TouchableRipple
          style={ styles.footerContainer }
          onPress={ () => setIsModalVisible(true) }
        >
          <Text style={ styles.footerText }>
            { `v${version}` }
          </Text>
        </TouchableRipple>
      </ScrollView>

      <Dialog
        visible={ isModalVisible }
        onDismiss={ () => setIsModalVisible(false) }
      >
        <Dialog.Title>Dev settings</Dialog.Title>
        <Dialog.Content>
          <SettingsDev { ...sectionProps } />
        </Dialog.Content>
      </Dialog>

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
  heading: {
    marginTop   : theme.spacing.extraLarge,
    marginBottom: theme.spacing.medium,
    paddingLeft : theme.spacing.medium,
  },
  footerContainer: {
    alignItems: 'center',
    padding   : theme.spacing.medium,
  },
  footerText: {
    color: theme.colors.neutral50,
  },
});

import React, { useState } from 'react';
import { Text, Snackbar, Modal, TouchableRipple } from 'react-native-paper';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
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
    <SafeAreaView style={ styles.container }>
      <ScrollView>
        <SettingsNotifications { ...sectionProps } />
        <SettingsAppearance { ...sectionProps } />
        <SettingsUpdates { ...sectionProps } />
        <SettingsDev { ...sectionProps } />

        <TouchableRipple
          style={ styles.footerContainer }
          onPress={ () => setIsModalVisible(true) }
        >
          <Text style={ styles.footerText }>
            { `v${version}` }
          </Text>
        </TouchableRipple>
      </ScrollView>

      <Modal
        visible={ isModalVisible }
        onDismiss={ () => setIsModalVisible(false) }
      >
        <View style={ styles.modalContainer }>
          <Text>
            ChangeLog?
            Hidden options?
          </Text>
        </View>
      </Modal>

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
  modalContainer: {
    alignSelf      : 'center',
    padding        : theme.spacing.medium,
    borderRadius   : 4,
    width          : '95%',
    minHeight      : '50%',
    backgroundColor: theme.colors.elevation.level5,
  },
});

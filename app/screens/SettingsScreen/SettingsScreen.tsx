import React, { useState } from 'react';
import { Text, TouchableRipple, Dialog } from 'react-native-paper';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { nativeApplicationVersion } from 'expo-application';
import theme from '@/theme';
import { SettingsDev } from './SettingsDev';
import { SettingsUpdates } from './SettingsUpdates';
import { SettingsAppearance } from './SettingsAppearance';
import { SettingsNotifications } from './SettingsNotifications';
import { SettingsInfo } from './SettingsInfo';

export function SettingsScreen() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const sectionProps = { headingStyle: styles.heading };

  return (
    <SafeAreaView>
      <ScrollView>
        <SettingsNotifications { ...sectionProps } />
        <SettingsAppearance { ...sectionProps } />
        <SettingsUpdates { ...sectionProps } />
        <SettingsInfo { ...sectionProps } />

        <TouchableRipple
          style={ styles.footerContainer }
          onPress={ () => setIsModalVisible(true) }
        >
          <Text style={ styles.footerText }>
            { `v ${nativeApplicationVersion}` }
          </Text>
        </TouchableRipple>
      </ScrollView>

      <Dialog
        visible={ isModalVisible }
        onDismiss={ () => setIsModalVisible(false) }
      >
        <Dialog.Title>Dev settings</Dialog.Title>
        <Dialog.Content>
          <SettingsDev />
        </Dialog.Content>
      </Dialog>
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

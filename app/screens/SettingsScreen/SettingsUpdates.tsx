import { Button, List, Text } from 'react-native-paper';
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as Updates from 'expo-updates';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ISettingSection } from './ISettingSection';
import { Icon } from '@/components';
import { useStores } from '@/models';
import { formatDate } from '@/utils/format-date';
import { checkAppUpdates, updateApp } from '@/services/updates';

export function SettingsUpdates({ headingStyle }: ISettingSection) {
  const { mainStore } = useStores();
  const { setSnackBarOptions } = mainStore;
  const [checkButtonText, setCheckButtonText] = useState<string>('check');
  const [checkButtonIcon, setCheckButtonIcon] = useState<IconProp>('sync');
  const [hasUpdates, setHasUpdates] = useState<boolean>(mainStore.hasUpdates);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const releaseDate = formatDate(Updates.createdAt, 'HH:mm DD.MM');

  useEffect(() => {
    let newButtonText = 'check';
    let newButtonIcon: IconProp = 'sync';

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

  const checkUpdates = () => {
    setIsChecking(true);

    checkAppUpdates()
      .then((result) => {
        setHasUpdates(result.isAvailable);

        if (!result.isAvailable)
          setSnackBarOptions('Last version installed already', 'success');
      })
      .catch((err) => {
        setSnackBarOptions(err, 'error');
      })
      .finally(() => {
        setIsChecking(false);
      });
  };

  const downloadUpdate = () => {
    setIsUpdating(true);

    return updateApp()
      .catch((err) => {
        setSnackBarOptions(err, 'error');
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const checkUpdateButton = useMemo(() => (
    <Button
      icon={ ({ color }) => <Icon icon={ checkButtonIcon } color={ color } size={ 12 } /> }
      disabled={ isChecking || isUpdating }
      onPress={ hasUpdates ? downloadUpdate : checkUpdates }
    >
      { checkButtonText }
    </Button>
  ), [checkButtonText, checkButtonIcon]);

  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Updates</Text>
      <List.Item
        title="Check updates"
        right={ () => checkUpdateButton }
      />

      <List.Item
        title="Release date"
        right={ () => <Text>{ releaseDate }</Text> }
      />
    </View>
  );
}

import { Button, List, Text } from 'react-native-paper';
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as Updates from 'expo-updates';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ISettingSection } from './ISettingSection';
import { Icon } from '@/components';
import { reportCrash } from '@/utils/crash-reporting';
import { useStores } from '@/models';
import { formatDate } from '@/utils/format-date';

const parseUpdateError = (e) => {
  if (e.code === 'ERR_UPDATES_DISABLED')
    return 'Updates disabled';

  if (e.code === 'ERR_UPDATES_RELOAD')
    return 'App reload error';

  if (e.code === 'ERR_UPDATES_CHECK')
    return e.message || 'Updates check error';

  if (e.code === 'ERR_UPDATES_FETCH')
    return e.message || 'Updated fetch error';

  return 'Unknown error';
};

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

  const checkUpdates = () => {
    setIsChecking(true);

    Updates.checkForUpdateAsync()
      .then((result) => {
        setHasUpdates(result.isAvailable);

        if (!result.isAvailable)
          setSnackBarOptions('Last version installed already', 'success');
      })
      .catch((e) => {
        setSnackBarOptions(parseUpdateError(e), 'error');
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
        setSnackBarOptions(parseUpdateError(e), 'error');
        reportCrash(e);
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

import { Button, List, Text } from 'react-native-paper';
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import moment from 'moment/moment';
import * as Updates from 'expo-updates';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ISettingSection } from './ISettingSection';
import { Icon } from '../../components';
import { reportCrash } from '../../utils/crash-reporting';
import { useStores } from '../../models';

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

export function SettingsUpdates({ headingStyle, setSnackBarMessage }: ISettingSection) {
  const { mainStore } = useStores();
  const [checkButtonText, setCheckButtonText] = useState<string>('check');
  const [checkButtonIcon, setCheckButtonIcon] = useState<IconProp>('sync');
  const [hasUpdates, setHasUpdates] = useState<boolean>(mainStore.hasUpdates);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

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

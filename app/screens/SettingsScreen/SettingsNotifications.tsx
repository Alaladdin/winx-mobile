import React, { useCallback, useState } from 'react';
import { List, Text, Switch } from 'react-native-paper';
import { View } from 'react-native';
import { map } from 'lodash';
import { ISettingSection } from './ISettingSection';
import { enableTask, disableTask, getEnabledTasks, isTaskEnabled, Task } from '@/services/scheduler';
import { reportCrash } from '@/utils/crash-reporting';
import { useStores } from '@/models';
import { Button } from '@/components';

const toggleTask = async (taskName: Task) => {
  const isRegistered = await isTaskEnabled(taskName);
  const action = isRegistered ? disableTask : enableTask;

  return action(taskName)
    .catch((err) => {
      reportCrash(err);

      throw err;
    });
};
export function SettingsNotifications({ headingStyle }: ISettingSection) {
  const { mainStore } = useStores();
  const [isScheduleTaskEnabled, setIsScheduleTaskEnabled] = useState<boolean>(false);
  const [isBarsTaskEnabled, setIsBarsTaskEnabled] = useState<boolean>(false);
  const onToggleError = useCallback((err) => mainStore.setSnackBarOptions(err?.message || err, 'error'), [mainStore]);

  React.useEffect(() => {
    isTaskEnabled('SCHEDULE_TASK')
      .then(setIsScheduleTaskEnabled)
      .catch(reportCrash);
  }, []);

  React.useEffect(() => {
    isTaskEnabled('BARS_TASK')
      .then(setIsBarsTaskEnabled)
      .catch(reportCrash);
  }, []);

  const toggleScheduleTask = useCallback(() => {
    const newValue = !isScheduleTaskEnabled;

    setIsScheduleTaskEnabled(newValue);

    toggleTask('SCHEDULE_TASK')
      .catch((err) => {
        setIsScheduleTaskEnabled(!newValue);
        onToggleError(err);
      });
  }, [isScheduleTaskEnabled, onToggleError]);

  const toggleBarsTask = useCallback(() => {
    const newValue = !isBarsTaskEnabled;

    setIsBarsTaskEnabled(newValue);

    toggleTask('BARS_TASK')
      .catch((err) => {
        setIsBarsTaskEnabled(!newValue);
        onToggleError(err);
      });
  }, [isBarsTaskEnabled, onToggleError]);

  const renderSwitch = useCallback((value: boolean, onChange: (newValue: boolean) => void) => (
    <Switch value={ value } onValueChange={ onChange } />
  ), []);

  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Notifications</Text>

      <List.Item
        title="About daily lessons"
        right={ () => renderSwitch(isScheduleTaskEnabled, toggleScheduleTask) }
      />

      <List.Item
        title="About new bars marks"
        right={ () => renderSwitch(isBarsTaskEnabled, toggleBarsTask) }
      />

      <Button
        text="Get enabled tasks"
        onPress={ () => {
          getEnabledTasks()
            .then((tasksList) => {
              const message = map(tasksList, 'taskName').join(', ') || 'no one';

              mainStore.setSnackBarOptions(message);
            });
        } }
      />
    </View>
  );
}

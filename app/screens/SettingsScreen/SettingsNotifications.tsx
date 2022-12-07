import React, { useCallback, useState } from 'react';
import { List, Text, Switch } from 'react-native-paper';
import { View } from 'react-native';
import { map } from 'lodash';
import { ISettingSection } from './ISettingSection';
import { enableTask, disableTask, getEnabledTasks, isTaskEnabled, Task } from '@/services/scheduler';
import { reportCrash } from '@/utils/crash-reporting';
import { useStores } from '@/models';
import { Button } from '@/components';

const toggleTask = async (taskName: Task, hours: number) => {
  const isRegistered = await isTaskEnabled(taskName);
  const action = isRegistered ? disableTask : enableTask;

  return action(taskName, hours)
    .catch((err) => {
      reportCrash(err);

      throw err;
    });
};
export function SettingsNotifications({ headingStyle }: ISettingSection) {
  const { mainStore } = useStores();
  const [isScheduleRegistered, setIsScheduleTaskRegistered] = useState<boolean>(false);
  const onToggleError = useCallback((err) => mainStore.setSnackBarOptions(err?.message || err, 'error'), [mainStore]);

  React.useEffect(() => {
    isTaskEnabled('SCHEDULE_TASK')
      .then(setIsScheduleTaskRegistered)
      .catch(reportCrash);
  }, []);

  const toggleScheduleTask = useCallback(() => {
    const newValue = !isScheduleRegistered;

    setIsScheduleTaskRegistered(newValue);

    toggleTask('SCHEDULE_TASK', 6)
      .catch((err) => {
        setIsScheduleTaskRegistered(!newValue);
        onToggleError(err);
      });
  }, [isScheduleRegistered, onToggleError]);

  const renderSwitch = useCallback((value: boolean, onChange: (newValue: boolean) => void) => (
    <Switch value={ value } onValueChange={ onChange } />
  ), []);

  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Notifications</Text>

      <List.Item
        title="About daily lessons"
        right={ () => renderSwitch(isScheduleRegistered, toggleScheduleTask) }
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

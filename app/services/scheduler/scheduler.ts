import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { each, find } from 'lodash/collection';
import { SchedulerTask, Task } from '@/services/scheduler/scheduler.types';
import { scheduleTask, barsTask } from '@/services/scheduler/tasks';

const tasks: SchedulerTask[] = [
  {
    name    : 'SCHEDULE_TASK',
    hours   : 6,
    executor: scheduleTask,
  },
  {
    name    : 'BARS_TASK',
    hours   : 3,
    executor: barsTask,
  },
];

export const initScheduler = () => {
  each(tasks, (task) => {
    TaskManager.defineTask(task.name, task.executor);
  });
};

export async function enableTask(taskName: Task) {
  const taskConfig = find(tasks, { name: taskName });

  return BackgroundFetch.registerTaskAsync(taskName, {
    minimumInterval: 60 * 60 * taskConfig.hours,
    stopOnTerminate: false,
    startOnBoot    : true,
  });
}

export async function disableTask(taskName: Task) {
  return BackgroundFetch.unregisterTaskAsync(taskName);
}

export async function isTaskEnabled(taskName: Task) {
  return TaskManager.isTaskRegisteredAsync(taskName);
}

export async function getEnabledTasks() {
  return TaskManager.getRegisteredTasksAsync();
}

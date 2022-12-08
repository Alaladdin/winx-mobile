import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import each from 'lodash/each';
import { SchedulerTask, Task } from '@/services/scheduler/scheduler.types';
import { scheduleTask } from '@/services/scheduler/schedule-task';
import { barsTask } from '@/services/scheduler/bars-task';

const tasks: SchedulerTask[] = [
  {
    name    : 'SCHEDULE_TASK',
    executor: scheduleTask,
  },
  {
    name    : 'BARS_TASK',
    executor: barsTask,
  },
];

export const initScheduler = () => {
  each(tasks, (task) => {
    TaskManager.defineTask(task.name, task.executor);
  });
};

export async function enableTask(taskName: Task, hours = 3) {
  return BackgroundFetch.registerTaskAsync(taskName, {
    minimumInterval: 60 * 60 * hours,
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

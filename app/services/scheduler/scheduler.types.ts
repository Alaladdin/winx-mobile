import { BackgroundFetchResult } from 'expo-background-fetch';
import { TaskManagerTaskBody } from 'expo-task-manager';

export type Task = 'SCHEDULE_TASK' | 'ACTUALITY_TASK' | 'BARS_TASK' | 'MAIL_TASK';

export type SchedulerTask = {
  name: Task,
  executor: (body: TaskManagerTaskBody) => Promise<BackgroundFetchResult>
}

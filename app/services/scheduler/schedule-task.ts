import * as BackgroundFetch from 'expo-background-fetch';
import { TaskManagerTaskBody } from 'expo-task-manager';
import moment from 'moment/moment';
import { reportCrash } from '@/utils/crash-reporting';
import { sendNotification } from '@/services/notifications';
import api from '@/services/api';
import config from '@/config';
import { formatDate } from '@/utils/format-date';
import { IScheduleItem } from '@/screens/ScheduleScreen/IScheduleItem';

export const scheduleTask = async (body: TaskManagerTaskBody) => {
  const { taskName } = body.executionInfo;
  const today = formatDate(undefined, config.serverDateFormat);

  api.get('/getSchedule', { params: { start: today, finish: today } })
    .then((data) => {
      const todaySchedule: IScheduleItem = data.schedule[0];

      if (!todaySchedule) return;

      const notificationBody = [
        `${todaySchedule.disciplineAbbr} · ${todaySchedule.kindOfWork}`,
        `${todaySchedule.beginLesson} — ${todaySchedule.endLesson}`,
        todaySchedule.auditorium,
      ];

      sendNotification({
        identifier: taskName,
        title     : 'You have a lesson today',
        body      : notificationBody.join('\n'),
        trigger   : {
          channelId: 'schedule',
          date     : moment(todaySchedule.fullDate).subtract(6, 'hours').toDate(),
        },
      });
    })
    .catch(reportCrash);

  return BackgroundFetch.BackgroundFetchResult.NewData;
};

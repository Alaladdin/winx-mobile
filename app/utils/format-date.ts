import moment from 'moment';
import config from '@/config';

export const formatDate = (date?: string, dateFormat?:string, toFormat?:string): string => {
  const outputFormat = toFormat || config.defaultDateFormat;

  return moment(date, dateFormat).format(outputFormat);
};

export const formatDateCalendar = (date) => moment(date).calendar({
  lastWeek: 'MMM DD',
  lastDay : '[Yesterday]',
  sameDay : 'LT',
  nextDay : '[Tomorrow]',
  nextWeek: 'MMM DD',
  sameElse: 'DD.MM.YY',
});

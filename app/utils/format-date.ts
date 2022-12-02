import moment, { MomentInput } from 'moment';

export const formatDate = (date?: MomentInput, toFormat?:string): string => moment(date).format(toFormat || 'DD.MM');

export const formatDateCalendar = (date: MomentInput) => moment(date).calendar({
  lastWeek: 'MMM DD',
  lastDay : '[Yesterday]',
  sameDay : 'LT',
  nextDay : '[Tomorrow]',
  nextWeek: 'MMM DD',
  sameElse: 'DD.MM.YY',
});

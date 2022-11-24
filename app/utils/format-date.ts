import moment from 'moment';
import config from '@/config';

export const formatDate = (date?: string, dateFormat?:string, toFormat?:string): string => {
  const outputFormat = toFormat || config.defaultDateFormat;

  return moment(date, dateFormat).format(outputFormat);
};

import { useCallback } from 'react';
import { Method } from 'axios';
import identity from 'lodash/identity';
import pick from 'lodash/pick';
import api from '@/services/api';

export interface IRequestConfig {
  method?: Method;
  url: string;
  data?: object;
  params?: object;
  onResponse?: (res) => any
  onError?: (res) => any
}

// export const useRequest = <T>(config: IRequestConfig): Promise<{ data: T }> => {
export const useRequest = (config: IRequestConfig) => useCallback(() => {
  const onResponse = config.onResponse || identity;
  const onError = config.onError || ((err) => { throw err; });
  const requestParams = pick(config, ['method', 'url', 'data', 'params']);

  return api(requestParams)
    .then(onResponse)
    .catch(onError);
}, [config]);

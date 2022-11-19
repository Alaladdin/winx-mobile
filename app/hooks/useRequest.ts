import { useCallback } from 'react';
import { Method } from 'axios';
import api from '@/services/api';

export interface IRequestConfig {
  method?: Method;
  url: string;
  data?: object;
  params?: object;
  afterResponse?: (res) => any
}

// export const useRequest = <T>(config: IRequestConfig): Promise<{ data: T }> => {
export const useRequest = (config: IRequestConfig) => useCallback(
  () => api({
    method: config.method,
    url   : config.url,
    data  : config.data,
    params: config.params,
  })
    .then((res) => config.afterResponse?.(res) || res),
  [config]
);

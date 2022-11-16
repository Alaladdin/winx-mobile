import { useCallback } from 'react';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { useStores } from '@/models';
import Config from '@/config';
import { reportCrash } from '@/utils/crash-reporting';

export interface IRequestConfig {
  url: string;
  method?: Method;
  data?: object;
  params?: object;
  afterResponse?: (res) => Array<any> | object
}

// export const useRequest = <T>(config: IRequestConfig): Promise<{ data: T }> => {
export const useRequest = (config: IRequestConfig) => {
  const { user, setUser } = useStores().authStore;
  return useCallback(() => axios({
    method : config.method,
    url    : config.url,
    data   : config.data,
    params : config.params,
    baseURL: Config.apiUrl,
    headers: {
      authToken    : Config.authToken,
      authorization: user?.token && `Bearer ${user.token}`,
    },
  })
    .then((res: AxiosResponse) => res.data)
    .then((res) => config.afterResponse?.(res) || res)
    .catch((error: AxiosError): string => {
      reportCrash(error);

      const { response, message } = error;

      if (response.status === 401)
        setUser(null);

      throw response.data?.error || message;
    }), [config, user?.token]);
};

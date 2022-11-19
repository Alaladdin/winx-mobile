import axios, { AxiosError, AxiosResponse } from 'axios';
import config from '@/config';
import { reportCrash } from '@/utils/crash-reporting';
import { loadString, remove } from '@/utils/storage';
import { getApiProblem } from '@/services/api/api-problem';
import { ApiProblem } from '@/services/api/api-problem.types';

const onSuccess = (res: AxiosResponse) => res.data;
const onError = async (error: AxiosError): Promise<ApiProblem> => {
  const problem = getApiProblem(error);

  reportCrash(problem);

  if (problem.kind === 'unauthorized')
    await remove('token');

  throw problem;
};

const apiInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    authToken: config.authToken,
  },
});

apiInstance.interceptors.request.use(async (request) => {
  request.headers.authorization = await loadString('token');

  return request;
});

apiInstance.interceptors.response.use(onSuccess, onError);

export default apiInstance;

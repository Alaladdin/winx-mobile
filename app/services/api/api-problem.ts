import { AxiosError } from 'axios';
import { ApiProblemCode, ApiProblem } from '@/services/api/api-problem.types';

const TIMEOUT_ERROR_CODES = ['ECONNABORTED'];
const NODEJS_CONNECTION_ERROR_CODES = ['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET'];
const isWithin = (value: number, min: number, max: number): boolean => (value >= min && value <= max);

export const getProblemFromError = (error: AxiosError): ApiProblemCode => {
  if (error.message === 'Network Error') return 'NETWORK_ERROR';
  if (TIMEOUT_ERROR_CODES.includes(error.code)) return 'TIMEOUT_ERROR';
  if (NODEJS_CONNECTION_ERROR_CODES.includes(error.code)) return 'CONNECTION_ERROR';

  return getProblemFromStatus(error.response?.status || null);
};

export const getProblemFromStatus = (status: undefined | number): ApiProblemCode => {
  if (status) {
    if (isWithin(status, 400, 499)) return 'CLIENT_ERROR';
    if (isWithin(status, 500, 599)) return 'SERVER_ERROR';
  }

  return 'UNKNOWN_ERROR';
};

// https://axios-http.com/docs/handling_errors
const getParsedError = (error: AxiosError): string | any => {
  const { response, message } = error;

  if (response?.data?.error)
    return response.data?.error;

  // if (request)
  //   return request;

  return message;
};

export function getApiProblem(error: AxiosError): ApiProblem {
  const problem = getProblemFromError(error);
  const { status } = error.response;
  const errorMessage = getParsedError(error);

  if (['NETWORK_ERROR', 'CONNECTION_ERROR'].includes(problem))
    return { kind: 'cannot-connect', message: errorMessage, temporary: true };

  if (problem === 'TIMEOUT_ERROR')
    return { kind: 'timeout', message: errorMessage, temporary: true };

  if (problem === 'SERVER_ERROR')
    return { kind: 'server', message: errorMessage };

  if (problem === 'CLIENT_ERROR') {
    if (status === 401)
      return { kind: 'unauthorized', message: errorMessage };

    if (status === 403)
      return { kind: 'forbidden', message: errorMessage };

    if (status === 404)
      return { kind: 'not-found', message: errorMessage };

    return { kind: 'rejected', message: errorMessage };
  }

  return { kind: 'unknown', message: errorMessage, temporary: true };
}

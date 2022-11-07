/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from 'apisauce';
import Config from '@/config';
import { GeneralApiProblem, getGeneralApiProblem } from './api-problem';
import type { ApiConfig } from './api.types';
import { reportCrash } from '@/utils/crash-reporting';

export const DEFAULT_API_CONFIG: ApiConfig = {
  apiUrl   : Config.apiUrl,
  authToken: Config.authToken,
  timeout  : 10000,
};

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance;

  config: ApiConfig;

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
    this.apisauce = create({
      baseURL: this.config.apiUrl,
      timeout: this.config.timeout,
      headers: {
        Accept   : 'application/json',
        AuthToken: this.config.authToken,
      },
    });
  }

  static onRequestSuccess(response: ApiResponse<any>): { ApiResponse: any } | GeneralApiProblem {
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);

      throw problem || response.originalError;
    }

    return response.data;
  }

  static onRequestError(err: Error): Error {
    reportCrash(err);

    throw err;
  }

  async get(url, params = {}, config = {}) {
    return this.apisauce.get(url, params, config)
      .then(Api.onRequestSuccess)
      .catch(Api.onRequestError);
  }

  async post(url, data, config?) {
    return this.apisauce.post(url, data, config)
      .then(Api.onRequestSuccess)
      .catch(Api.onRequestError);
  }
}

// Singleton instance of the API for convenience
export const api = new Api();

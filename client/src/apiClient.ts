import axios, { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import { getStoredUser } from './features/users';

const apiBaseURL = process.env.API_BASE_URL ?? 'http://localhost:3000';

const config: CreateAxiosDefaults = {
  baseURL: `${apiBaseURL}/api`,
};

const requestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const user = getStoredUser();

  if (user && config.headers) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
};

const publicClient = axios.create(config);

const privateClient = axios.create(config);
privateClient.interceptors.request.use(requestInterceptor);

export { publicClient, privateClient };

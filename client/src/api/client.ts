import axios, { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import { getStoredUser } from '../user-storage';

const config: CreateAxiosDefaults = {
  baseURL: 'https://chirper-api.up.railway.app/api',
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

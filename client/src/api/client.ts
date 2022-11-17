import axios, { AxiosRequestConfig } from 'axios';
import { getStoredUser } from '../user-storage';

const BASE_URL = 'http://localhost:3000/api';

const config = {
  baseURL: BASE_URL,
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

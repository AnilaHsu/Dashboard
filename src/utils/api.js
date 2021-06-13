import axios from 'axios';
import { baseURL } from './constants'

const service = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  timeout: 1000 * 10,
});

service.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export default service;
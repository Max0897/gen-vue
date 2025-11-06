import axios from 'axios';
import { message } from 'ant-design-vue';

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL || '/api',
  timeout: 10000,
  withCredentials: true,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    const messageText =
      response?.data?.message || response?.statusText || error.message || '请求失败';

    if (messageText) {
      message.error(messageText);
    }

    return Promise.reject(error);
  },
);

export default http;

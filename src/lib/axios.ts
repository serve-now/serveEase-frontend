import axios from 'axios';
import { getCookie } from './cookies';
import { captureDomainError } from './sentry/capture';

export const instance = axios.create({
  baseURL: '/api/bff',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401) {
      alert('로그인이 만료되었습니다.');
      console.warn(`인증 문제 (${status})`);

      document.cookie = 'isLoggedIn=; Max-Age=0; path=/;';
      document.cookie = 'storeId=; Max-Age=0; path=/;';
      document.cookie = 'storeName=; Max-Age=0; path=/;';
      try {
        localStorage.removeItem('storeId');
        localStorage.removeItem('storeName');
      } catch {}

      const currentPath = window.location.pathname;
      document.cookie = 'accessToken=; Max-Age=0; path=/;';

      window.location.href = `/?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    const isServerError = status >= 500;
    const isNetworkError = !error.response;

    if (isServerError || isNetworkError) {
      captureDomainError({
        error,
        feature: 'api',
        step: 'response',
        level: 'error',
        context: {
          method: error.config?.method,
          url: error.config?.url,
          status,
        },
      });
    }

    return Promise.reject(error);
  },
);

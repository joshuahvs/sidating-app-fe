import axios, { AxiosError } from 'axios';
import { getAuthToken, handleAuthError } from './auth';
import { useRouter } from 'vue-router';

// Central axios instance with auth header + 401/403 handling
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (resp) => resp,
  async (error: AxiosError) => {
    const router = useRouter();
    if (error.response) {
      const status = error.response.status;
      await handleAuthError(status, router);
    }
    return Promise.reject(error);
  }
);

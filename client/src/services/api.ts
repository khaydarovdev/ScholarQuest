import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api',
  withCredentials: true,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    const original = error.config as (typeof error.config & { _retry?: boolean; headers?: Record<string, string> }) | undefined;
    const auth = useAuthStore();

    if (error.response?.status === 401 && original && !original._retry && original.url !== '/auth/refresh') {
      original._retry = true;
      const refreshed = await auth.refreshSession().catch(() => false);
      if (refreshed) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${auth.accessToken}`;
        return api(original);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

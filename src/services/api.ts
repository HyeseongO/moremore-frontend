// services/api.ts
import axios, { type AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('Response error:', error.response?.status);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        console.log('Refresh token failed:', refreshError);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Api.js
import axios from 'axios';
import { useAuthStore } from '@/store';

export default () => {
  const instance = axios.create({
    baseURL: 'http://localhost:3001/api', // Make sure your server is running on this URL
  });

  instance.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      const token = authStore.token; // Assuming you store the token in your store
      if (token) {
        config.headers.Authorization = `${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance; // Return the Axios instance with the interceptor
};

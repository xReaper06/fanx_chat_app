// Api.js
import axios from 'axios';
import { useAuthStore } from '@/store';

export default () => {
  const instance = axios.create({
    baseURL: 'http://localhost:3001/api', // Make sure your server is running on this URL
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken'); // Assuming you store the token in your store
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const authStore = useAuthStore();
      const originalRequest = error.config;
  
      // Check if the error response indicates an expired token
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        // Set a flag to prevent infinite retry loops
        originalRequest._retry = true;
  
        try {
          // Attempt to refresh the access token using the refresh token
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available.');
          }
          console.log(refreshToken)
  
          const refreshResponse = await axios.post('http://localhost:3002/api/refresh-token', { token:refreshToken });
  
          // Update the access token in your Vue.js app and the Auth store
          const newAccessToken = refreshResponse.data.accessToken;
          const newUserResult = refreshResponse.data.user;
          authStore.updateLocalUser(newUserResult);
          authStore.updateAccessToken(newAccessToken); // Assuming you have a mutation to update the token
  
          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Handle the refresh error (e.g., redirect to login)
          console.error('Token refresh failed:', refreshError);
          // Redirect to the login page or handle the error as needed
        }
      }
      return Promise.reject(error);
    }
  );

  return instance; // Return the Axios instance with the interceptor
};

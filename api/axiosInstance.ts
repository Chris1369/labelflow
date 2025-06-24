import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEnvironmentConfig } from '@/helpers/environment';
import { StorageKeys } from '@/helpers/StorageKeys';

const { apiUrl } = getEnvironmentConfig();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(StorageKeys.ACCESS_TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem(StorageKeys.REFRESH_TOKEN);
        
        if (refreshToken) {
          const response = await axios.post(`${apiUrl}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          await AsyncStorage.setItem(StorageKeys.ACCESS_TOKEN, accessToken);
          await AsyncStorage.setItem(StorageKeys.REFRESH_TOKEN, newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.multiRemove([
          StorageKeys.ACCESS_TOKEN,
          StorageKeys.REFRESH_TOKEN,
          StorageKeys.USER_DATA,
        ]);
        
        // TODO: Navigate to login screen
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
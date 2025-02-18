// src/api/index.ts
import axios from 'axios';
import i18next from 'i18next';

// Create axios instance with default config
const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the current language
api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18next.language || 'en';
  // Get token from localStorage
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear token on 401 errors
        localStorage.removeItem('token');
      }
      return Promise.reject(error);
    }
  );

export default api;
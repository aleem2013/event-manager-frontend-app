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
  config.headers['Accept-Language'] = i18next.language;
  return config;
});

export default api;
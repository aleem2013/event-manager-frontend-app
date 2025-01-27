import api from './index';

const API_URL = import.meta.env.VITE_API_URL; //'https://event-management-frontend-5e7ap9o9a.vercel.app';//'http://localhost:3000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  [x: string]: any;
  access_token: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post(`${API_URL}/api/auth/login`, credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post(`${API_URL}/api/auth/register`, credentials);
  return response.data;
};
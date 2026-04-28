import api from './api';
import type { User } from '../types/User';

export interface LoginDTO {
  email: string;
  password: string;    
}

export interface AuthResponse {
  token: string;
  user: User;
}

const authService = {
  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  changePassword: async (changePasswordData: { oldPassword?: string; newPassword: string }): Promise<void> => {
    await api.post('/auth/change-password', changePasswordData);
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
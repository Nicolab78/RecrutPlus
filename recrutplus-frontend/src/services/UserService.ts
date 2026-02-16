import api from './api';
import type { User, CreateUserDTO, UpdateUserDTO } from '../types/User';

const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateUserDTO): Promise<User> => {
    const response = await api.put<User>('/users/profile', data);
    return response.data;
  },

  getAll: async (role?: string): Promise<User[]> => {
    const params = role ? `?role=${role}` : '';
    const response = await api.get<User[]>(`/users${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDTO): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  update: async (id: number, data: UpdateUserDTO): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  toggleStatus: async (id: number, isActive: boolean): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/status`, { isActive });
    return response.data;
  }
};

export default userService;
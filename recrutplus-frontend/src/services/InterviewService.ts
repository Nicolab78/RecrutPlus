import api from './api';
import type { Interview, CreateInterviewDTO, UpdateInterviewDTO, InterviewStatus } from '../types/Interview';

const interviewService = {
  create: async (data: CreateInterviewDTO): Promise<Interview> => {
    const response = await api.post<Interview>('/interviews/create', data);
    return response.data;
  },

  getById: async (id: number): Promise<Interview> => {
    const response = await api.get<Interview>(`/interviews/${id}`);
    return response.data;
  },

  getAll: async (status?: InterviewStatus): Promise<Interview[]> => {
  const params = status ? `?status=${status}` : '';
  const response = await api.get<Interview[]>(`/interviews/all${params}`);
  return response.data;
},

  getMyInterviews: async (): Promise<Interview[]> => {
  const response = await api.get<Interview[]>('/interviews/me');
  return response.data;
},

  

  update: async (id: number, data: UpdateInterviewDTO): Promise<Interview> => {
    const response = await api.put<Interview>(`/interviews/${id}`, data);
    return response.data;
  },

  cancel: async (id: number): Promise<void> => {
    await api.put(`/interviews/${id}/cancel`);
  },
  
};

export default interviewService;
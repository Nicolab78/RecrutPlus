import api from './api';
import type { Application, CreateApplicationDTO, UpdateApplicationDTO, ProcessApplicationDTO, ApplicationStatus } from '../types/Application';

const applicationService = {
  submit: async (data: CreateApplicationDTO, cv?: File): Promise<Application> => {
    const response = await api.post<Application>('/applications/submit', data);
    return response.data;
    
    /* À réactiver plus tard quand le CV sera géré :
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (cv) {
      formData.append('cv', cv);
    }

    const response = await api.post<Application>('/applications/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
    */
  },

  getById: async (id: number): Promise<Application> => {
    const response = await api.get<Application>(`/applications/${id}`);
    return response.data;
  },

  getMyApplications: async (): Promise<Application[]> => {
    const response = await api.get<Application[]>('/applications/me');
    return response.data;
  },

  getAll: async (status?: ApplicationStatus, jobOfferId?: number, email?: string): Promise<Application[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (jobOfferId) params.append('jobOfferId', jobOfferId.toString());
    if (email) params.append('email', email);

    const response = await api.get<Application[]>(`/applications?${params.toString()}`);
    return response.data;
  },

  getByJobOffer: async (jobOfferId: number): Promise<Application[]> => {
    const response = await api.get<Application[]>(`/applications/job-offer/${jobOfferId}`);
    return response.data;
  },

  getByStatus: async (status: ApplicationStatus): Promise<Application[]> => {
    const response = await api.get<Application[]>(`/applications/status/${status}`);
    return response.data;
  },

  process: async (id: number, data: ProcessApplicationDTO): Promise<Application> => {
    const response = await api.put<Application>(`/applications/${id}/process`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateApplicationDTO): Promise<Application> => {
    const response = await api.put<Application>(`/applications/${id}`, data);
    return response.data;
  }
};

export default applicationService;
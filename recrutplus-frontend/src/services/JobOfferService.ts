import api from './api';
import type { JobOffer, CreateJobOfferDTO, UpdateJobOfferDTO, Specialty, ContractType } from '../types/JobOffer';

const jobOfferService = {
  getAll: async (): Promise<JobOffer[]> => {
    const response = await api.get<JobOffer[]>('/job-offers');
    return response.data;
  },

  getActive: async (): Promise<JobOffer[]> => {
    const response = await api.get<JobOffer[]>('/job-offers/active');
    return response.data;
  },

  getById: async (id: number): Promise<JobOffer> => {
    const response = await api.get<JobOffer>(`/job-offers/${id}`);
    return response.data;
  },

  search: async (keyword?: string, specialty?: Specialty, contractType?: ContractType): Promise<JobOffer[]> => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (specialty) params.append('specialty', specialty);
    if (contractType) params.append('contractType', contractType);
    
    const response = await api.get<JobOffer[]>(`/job-offers/search?${params.toString()}`);
    return response.data;
  },

  getBySpecialty: async (specialty: Specialty): Promise<JobOffer[]> => {
    const response = await api.get<JobOffer[]>(`/job-offers/specialty/${specialty}`);
    return response.data;
  },

  getAllSpecialties: async (): Promise<Specialty[]> => {
    const response = await api.get<Specialty[]>('/job-offers/specialties');
    return response.data;
  },

  getAllContractTypes: async (): Promise<ContractType[]> => {
    const response = await api.get<ContractType[]>('/job-offers/contract-types');
    return response.data;
  },

  create: async (data: CreateJobOfferDTO): Promise<JobOffer> => {
    const response = await api.post<JobOffer>('/job-offers', data);
    return response.data;
  },

  update: async (id: number, data: UpdateJobOfferDTO): Promise<JobOffer> => {
    const response = await api.put<JobOffer>(`/job-offers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/job-offers/${id}`);
  }
};

export default jobOfferService;
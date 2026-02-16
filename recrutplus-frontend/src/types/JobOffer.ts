import type { Address } from './Address';

export enum Specialty {
  IT = 'IT',
  FINANCE = 'FINANCE',
  MARKETING = 'MARKETING',
  RH = 'RH',
  COMMERCIAL = 'COMMERCIAL',
  LOGISTIQUE = 'LOGISTIQUE',
  SANTE = 'SANTE',
  EDUCATION = 'EDUCATION'
}

export enum ContractType {
  CDI = 'CDI',
  CDD = 'CDD',
  STAGE = 'STAGE',
  ALTERNANCE = 'ALTERNANCE'
}

export interface JobOffer {
  id: number;
  title: string;
  specialty: Specialty;
  contractType: ContractType;
  content: string;
  address?: Address;
  salary?: number;
  isActive: boolean;
  creationDate: string;
  updatedAt?: string;
  applicationsCount?: number;
}

export interface CreateJobOfferDTO {
  title: string;
  specialty: Specialty;
  contractType: ContractType;
  content: string;
  address?: Address;
  salary?: number;
}

export interface UpdateJobOfferDTO {
  title?: string;
  specialty?: Specialty;
  contractType?: ContractType;
  content?: string;
  address?: Address;
  salary?: number;
  isActive?: boolean;
}
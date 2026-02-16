import type { Address } from './Address';
import type { JobOffer } from './JobOffer';
import type { User } from './User';

export enum ApplicationStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS', 
  ACCEPTE_ENTRETIEN = 'ACCEPTE_ENTRETIEN',
  ENTRETIEN_TERMINE = 'ENTRETIEN_TERMINE',
  REFUSE = 'REFUSE',
  EMBAUCHE = 'EMBAUCHE',
  REFUSE_APRES_ENTRETIEN = 'REFUSE_APRES_ENTRETIEN'
}

export interface Application {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birthdate?: string;
  address?: Address;
  cvPath?: string;
  coverLetter: string;
  status: ApplicationStatus;
  applicationDate: string;
  processedAt?: string;
  comment?: string;
  updatedAt?: string;
  jobOffer: JobOffer;
  user?: User;
}

export interface CreateApplicationDTO {
  jobOfferId: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birthdate?: string;
  address?: Address;
  coverLetter: string;
}

export interface UpdateApplicationDTO {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
  status?: ApplicationStatus;
  comment?: string;
}

export interface ProcessApplicationDTO {
  status: ApplicationStatus;
  comment?: string;
}
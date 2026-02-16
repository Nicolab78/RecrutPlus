import type { Address } from './Address';
import type { Application } from './Application';

export enum InterviewType {
  VISIO = 'VISIO',
  PRESENTIEL = 'PRESENTIEL'
}

export enum InterviewStatus {
  PLANIFIE = 'PLANIFIE',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}

export interface Interview {
  id: number;
  interviewDate: string;
  type: InterviewType;
  visioLink?: string;
  address?: Address;
  status: InterviewStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  cancelledAt?: string;
  application: Application;
}

export interface CreateInterviewDTO {
  applicationId: number;
  interviewDate: string;
  type: InterviewType;
  visioLink?: string;
  address?: Address;
  notes?: string;
}

export interface UpdateInterviewDTO {
  interviewDate?: string;
  type?: InterviewType;
  visioLink?: string;
  address?: Address;
  status?: InterviewStatus;
  notes?: string;
}
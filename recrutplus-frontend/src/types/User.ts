import type { Address } from "./Address";

export enum UserRole {
  ADMIN = 'ADMIN',
  RH = 'RH',
  CANDIDAT = 'CANDIDAT'
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  birthdate?: string;
  role: UserRole;
  address?: Address;
  isActive?: boolean;
  mustChangePassword?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDTO {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birthdate?: string;
  role: UserRole;
  password: string;
  address?: Address;
  isActive?: boolean;
}

export interface UpdateUserDTO {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  role?: UserRole;
  password?: string;
  address?: Address;
  isActive?: boolean;
}
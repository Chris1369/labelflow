import { Label } from './label';

export interface Category {
  id: string;
  _id?: string;
  name: string;
  labels: (string | Label)[]; // Array of Label IDs or populated Label objects
  ownerId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateCategoryRequest {
  name: string;
  labels?: string[];
  isPublic?: boolean;
  ownerId?: string; // Optional car on peut le récupérer du user connecté
}

export interface UpdateCategoryRequest {
  name?: string;
  labels?: string[];
  isPublic?: boolean;
}
export interface Category {
  id: string;
  _id?: string;
  name: string;
  labels: string[]; // Array of Label IDs
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
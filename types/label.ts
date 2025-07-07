export interface Label {
  id: string;
  _id?: string;
  name: string;
  ownerId: string;
  subIds: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateLabelRequest {
  name: string;
  isPublic?: boolean;
  ownerId?: string; // Optional car on peut le récupérer du user connecté
}

export interface UpdateLabelRequest {
  name?: string;
  isPublic?: boolean;
}

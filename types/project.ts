export interface Project {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  description: string;
  items: string[]; // Array of ProjectItem IDs
  ownerId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number; // MongoDB version key
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  isPublic?: boolean;
  ownerId?: string; // Optional car on peut le récupérer du user connecté
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
  items?: string[];
}

export interface ProjectItem {
  id: string;
  _id?: string;
  projectId?: string;
  filePath?: string;
  fileUrl: string;
  labels: {
    id: string;
    _id?: string;
    name: string;
    position: string[]; // [centerX, centerY, width, height]
  }[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateProjectItemRequest {
  projectId: string;
  image: string;
  label: string;
  position: {
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    rotation: number;
  }[];
}

export interface UpdateProjectItemRequest {
  image?: string;
  label?: string;
  position?: {
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    rotation: number;
  }[];
}

export interface ProjectItemsResponse {
  projectItems: ProjectItem[];
  total: number;
  totalPage: number;
  page: number;
  limit: number;
}
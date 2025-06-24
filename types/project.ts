export interface Project {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectItem {
  id: string;
  projectId: string;
  imagePath: string;
  boundingBox: {
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    rotation: number;
  };
  createdAt: Date;
}
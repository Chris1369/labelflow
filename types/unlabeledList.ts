export interface UnlabeledListItem {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface UnlabeledList {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  projectId: string;
  items: UnlabeledListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnlabeledListRequest {
  name: string;
  projectId: string;
  images: File[];
}

export interface AddImagesToListRequest {
  images: File[];
}

export interface UpdateUnlabeledListRequest {
  name: string;
}

export interface ValidateItemResponse {
  projectItem: any; // ProjectItem type
  message: string;
}
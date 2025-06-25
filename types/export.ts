export type ExportType = 
  | 'yolo'
  | 'yolo-v8-obb'
  | 'json'
  | 'json-min'
  | 'csv'
  | 'tsv'
  | 'coco'
  | 'pascal-voc';

export interface CreateExportRequest {
  ownerId: string;
  fromProjectId: string;
  type: ExportType;
}

export interface Export {
  _id: string;
  ownerId: string;
  fromProjectId: string;
  type: ExportType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExportResponse {
  success: boolean;
  data: Export;
}
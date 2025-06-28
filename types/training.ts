export interface TrainingClass {
  class_id: number;
  name: string;
  description?: string;
}

export interface CreateClassRequest {
  name: string;
  description?: string;
}

export interface Annotation {
  x: number; // Centre X normalisé (0-1)
  y: number; // Centre Y normalisé (0-1)
  width: number; // Largeur normalisée (0-1)
  height: number; // Hauteur normalisée (0-1)
  label: string; // Nom de la classe
  class_id?: number; // ID de la classe (optionnel)
}

export interface AnnotationRequest {
  annotations: Annotation[];
}

export interface TrainingAnnotationFormData {
  file: any; // Image file
  image_width: string;
  image_height: string;
  annotations: string; // JSON stringified AnnotationRequest
}

export interface TrainingConfig {
  epochs?: number;
  batch_size?: number;
  use_hybrid?: boolean;
}

export interface TrainingResponse {
  message: string;
  task_id?: string;
  status?: string;
}
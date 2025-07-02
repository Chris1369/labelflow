export interface CaptureAngle {
  position: string;
  count: number;
  lighting?: "natural" | "artificial" | "mixed" | "low";
  description?: string;
  icon?: string;
}

export interface CaptureTemplate {
  id: string;
  name: string;
  description: string;
  angles: CaptureAngle[];
  totalPhotos: number;
  estimatedTime: number; // en minutes
  difficulty: "easy" | "medium" | "hard";
  useCase: string[];
}

export interface CaptureSession {
  templateId: string;
  productId: string;
  currentAngleIndex: number;
  currentCount: number;
  completedAngles: string[];
  startTime: Date;
  photos: CapturedPhoto[];
  status: "setup" | "capturing" | "completed" | "paused";
}

export interface CapturedPhoto {
  id: string;
  angle: string;
  timestamp: Date;
  uri: string;
  quality: number; // 0-1
  metadata: {
    lighting: string;
    distance: number;
    blur: boolean;
    valid: boolean;
  };
}

export interface BoundingBox {
  id: string;
  centerX: number; // Relative position (0-1)
  centerY: number; // Relative position (0-1)
  width: number; // Relative size (0-1)
  height: number; // Relative size (0-1)
  rotation: number; // Degrees
  label?: string;
  isComplete: boolean;
}

export interface CameraPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}
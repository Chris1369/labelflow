export interface BoundingBox {
  id: string;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotation: number;
  label?: string;
  isComplete: boolean;
}
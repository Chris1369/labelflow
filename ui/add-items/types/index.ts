import { BoundingBox } from "../useStore";

export interface AddItemsScreenProps {
  projectId?: string;
  isForUnlabeled?: boolean;
  unlabeledListId?: string;
}

export interface CameraModeSectionProps {
  isCameraReady: boolean;
  cameraRef: React.RefObject<any>;
  isCapturing: boolean;
  flashMode: string;
  onCapture: () => void;
  onImport: () => void;
  onFlashModeChange: (mode: string) => void;
}

export interface CaptureModeSectionProps {
  capturedImageUri: string;
  boundingBoxes: BoundingBox[];
  currentBoxId: string | null;
  showSaveButton: boolean;
  hasCompletedBoxes: boolean;
  hasUncompletedBoxes: boolean;
  hasUnknownBoxes: boolean;
  hasNextImage: boolean;
  isSaving: boolean;
  isPredicting: boolean;
  isForUnlabeled: boolean;
  currentUnlabeledIndex: number;
  unlabeledListItems: any[];
  currentProject: any;
  unlabeledListPredictionLabels: string[];
  onBoxUpdate: (id: string, x: number, y: number, width: number, height: number, rotation: number) => void;
  onSelectBox: (id: string) => void;
  onDeleteBox: (id: string) => void;
  onEditLabel: (id: string) => void;
  onRetake: () => void;
  onAddBox: () => void;
  onValidate: () => void;
  onPredict: () => void;
  onNextImage: () => void;
  onSelectLabel: (label: string) => void;
}

export interface UnlabeledListEmptySectionProps {
  projectId: string;
  unlabeledListId?: string;
}

export interface LoadingSectionProps {
  message: string;
}
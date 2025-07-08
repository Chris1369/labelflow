import React from "react";
import { CameraViewComponent } from "../components";
import { CameraModeSectionProps } from "../types";

export const CameraModeSection: React.FC<CameraModeSectionProps> = ({
  isCameraReady,
  cameraRef,
  isCapturing,
  flashMode,
  onCapture,
  onImport,
  onFlashModeChange,
}) => {
  if (!isCameraReady) {
    return null;
  }

  return (
    <CameraViewComponent
      cameraRef={cameraRef}
      isCapturing={isCapturing}
      onCapture={onCapture}
      onImport={onImport}
      flashMode={flashMode}
      onFlashModeChange={onFlashModeChange}
    />
  );
};
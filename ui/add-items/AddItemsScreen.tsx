import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useAddItemsStore } from "./useStore";
import { addItemsActions } from "./actions";
import { useProjectDetails } from "@/hooks/queries";
import { useInitialization, useHandlers } from "./hooks";
import {
  CameraModeSection,
  CaptureSection,
  UnlabeledListEmptySection,
  LoadingSection,
} from "./sections";
import { PermissionView } from "./components";
import { AddItemsScreenProps } from "./types";

export const AddItemsScreen: React.FC<AddItemsScreenProps> = ({
  projectId: propProjectId,
  isForUnlabeled = false,
  unlabeledListId,
}) => {
  const params = useLocalSearchParams();
  const projectId = propProjectId || (params.id as string);

  const {
    hasPermission,
    capturedImageUri,
    boundingBoxes,
    currentBoxId,
    isCapturing,
    showSaveButton,
    isSaving,
    flashMode,
    setFlashMode,
    unlabeledListItems,
    currentUnlabeledIndex,
    isPredicting,
    unlabeledListPredictionLabels,
  } = useAddItemsStore();

  const { data: currentProject } = useProjectDetails(projectId);
  
  const { isCameraReady } = useInitialization({
    isForUnlabeled,
    unlabeledListId,
    currentProject,
  });

  const {
    cameraRef,
    bottomSheetRef,
    handleCapture,
    handleImport,
    handleBoxUpdate,
    handleValidate,
    handleSelectLabel,
    handleDeleteBox,
    handleEditLabel,
    handleAddBox,
    handleSelectBox,
    handleNextImage,
    hasNextImage,
  } = useHandlers({
    projectId,
    isForUnlabeled,
    unlabeledListId,
  });

  const hasCompletedBoxes = boundingBoxes.some((box) => box.isComplete);
  const hasUncompletedBoxes = boundingBoxes.some((box) => !box.isComplete);
  const hasUnknownBoxes = boundingBoxes.some(
    (box) => box.label === "???" || box.label === "Objet non identifié"
  );

  // Handle permission states - Skip for UnlabeledList mode
  if (!isForUnlabeled && (hasPermission === null || hasPermission === false)) {
    return <PermissionView hasPermission={hasPermission} />;
  }

  // Show captured image with bounding boxes
  if (capturedImageUri) {
    return (
      <CaptureSection
        capturedImageUri={capturedImageUri}
        boundingBoxes={boundingBoxes}
        currentBoxId={currentBoxId}
        showSaveButton={showSaveButton}
        hasCompletedBoxes={hasCompletedBoxes}
        hasUncompletedBoxes={hasUncompletedBoxes}
        hasUnknownBoxes={hasUnknownBoxes}
        hasNextImage={hasNextImage}
        isSaving={isSaving}
        isPredicting={isPredicting}
        isForUnlabeled={isForUnlabeled}
        currentUnlabeledIndex={currentUnlabeledIndex}
        unlabeledListItems={unlabeledListItems}
        currentProject={currentProject}
        unlabeledListPredictionLabels={unlabeledListPredictionLabels}
        bottomSheetRef={bottomSheetRef}
        onBoxUpdate={handleBoxUpdate}
        onSelectBox={handleSelectBox}
        onDeleteBox={handleDeleteBox}
        onEditLabel={handleEditLabel}
        onRetake={addItemsActions.retakePicture}
        onAddBox={handleAddBox}
        onValidate={handleValidate}
        onPredict={() => addItemsActions.predictBoundingBoxes(capturedImageUri)}
        onNextImage={handleNextImage}
        onSelectLabel={handleSelectLabel}
      />
    );
  }

  // Show loading state for UnlabeledList mode
  if (isForUnlabeled && unlabeledListItems.length === 0 && !capturedImageUri) {
    return (
      <UnlabeledListEmptySection
        projectId={projectId}
        unlabeledListId={unlabeledListId}
      />
    );
  }

  // Show camera view only when ready (not in UnlabeledList mode)
  if (!isForUnlabeled && !isCameraReady) {
    return <LoadingSection message="Préparation de la caméra..." />;
  }

  // Show camera only in normal mode
  if (!isForUnlabeled) {
    return (
      <CameraModeSection
        isCameraReady={isCameraReady}
        cameraRef={cameraRef}
        isCapturing={isCapturing}
        flashMode={flashMode}
        onCapture={handleCapture}
        onImport={handleImport}
        onFlashModeChange={setFlashMode}
      />
    );
  }

  // UnlabeledList mode but no image shown yet
  return <LoadingSection message="Chargement de l'image..." />;
};
import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LabelBottomSheet, LabelBottomSheetRef } from "@/components/organisms";
import { theme } from "@/types/theme";
import { useAddItemsStore } from "./useStore";
import { addItemsActions } from "./actions";
import {
  PermissionView,
  CameraViewComponent,
  CapturedImageView,
  ControlButtons,
} from "./components";

export const AddItemsScreen: React.FC = () => {
  const { id: projectId } = useLocalSearchParams();
  const cameraRef = useRef<any>(null);
  const bottomSheetRef = useRef<LabelBottomSheetRef>(null);
  const {
    hasPermission,
    capturedImageUri,
    boundingBoxes,
    currentBoxId,
    isCapturing,
    showSaveButton,
    isSaving,
  } = useAddItemsStore();

  useEffect(() => {
    (async () => {
      const hasPermission = await addItemsActions.checkCameraPermission();
      if (!hasPermission) {
        await addItemsActions.requestCameraPermission();
      }
    })();
  }, []);

  const handleCapture = () => {
    addItemsActions.takePicture(cameraRef.current);
  };

  const handleImport = () => {
    addItemsActions.importFromGallery();
  };

  const handleBoxUpdate = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
  ) => {
    useAddItemsStore.getState().updateBoundingBox(id, {
      centerX: x,
      centerY: y,
      width,
      height,
      rotation,
    });
  };


  const handleValidate = () => {
    if (currentBoxId) {
      // Validate current box - open label selector
      bottomSheetRef.current?.open();
    } else {
      // Save all items
      addItemsActions.saveAllItems(projectId as string);
    }
  };

  const handleSelectLabel = (label: string) => {
    if (currentBoxId) {
      useAddItemsStore.getState().setLabelForBox(currentBoxId, label);
    }
  };

  const handleAddBox = () => {
    useAddItemsStore.getState().addBoundingBox();
  };

  const handleSelectBox = (id: string) => {
    useAddItemsStore.getState().setCurrentBox(id);
  };

  const hasCompletedBoxes = boundingBoxes.some(box => box.isComplete);
  const hasUncompletedBoxes = boundingBoxes.some(box => !box.isComplete);

  // Handle permission states
  if (hasPermission === null || hasPermission === false) {
    return <PermissionView hasPermission={hasPermission} />;
  }

  // Show captured image with bounding boxes
  if (capturedImageUri) {
    return (
      <View style={styles.container}>
        <CapturedImageView
          capturedImageUri={capturedImageUri}
          boundingBoxes={boundingBoxes}
          currentBoxId={currentBoxId}
          onBoxUpdate={handleBoxUpdate}
          onSelectBox={handleSelectBox}
        />

        <ControlButtons
          currentBoxId={currentBoxId}
          boundingBoxes={boundingBoxes}
          showSaveButton={showSaveButton}
          hasCompletedBoxes={hasCompletedBoxes}
          hasUncompletedBoxes={hasUncompletedBoxes}
          isSaving={isSaving}
          onRetake={addItemsActions.retakePicture}
          onAddBox={handleAddBox}
          onValidate={handleValidate}
        />

        <LabelBottomSheet
          ref={bottomSheetRef}
          onSelectLabel={handleSelectLabel}
        />
      </View>
    );
  }

  // Show camera view
  return (
    <CameraViewComponent
      cameraRef={cameraRef}
      isCapturing={isCapturing}
      onCapture={handleCapture}
      onImport={handleImport}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
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
  RecentLabelsBar,
} from "./components";
import { RecentLabelsManager } from "@/helpers/recentLabels";
import { resetLabelColors } from "@/helpers/labelColors";

export const AddItemsScreen: React.FC = () => {
  const { id: projectId } = useLocalSearchParams();
  const cameraRef = useRef<any>(null);
  const bottomSheetRef = useRef<LabelBottomSheetRef>(null);
  const [isCameraReady, setIsCameraReady] = React.useState(false);
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
  } = useAddItemsStore();

  useEffect(() => {
    let mounted = true;

    const initializeCamera = async () => {
      try {
        if (!mounted) return;
        
        // Add delay to prevent immediate camera access
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (mounted) {
          const hasPermission = await addItemsActions.checkCameraPermission();
          if (!hasPermission && mounted) {
            await addItemsActions.requestCameraPermission();
          }
          
          // Mark camera as ready after another small delay
          if (mounted) {
            await new Promise(resolve => setTimeout(resolve, 200));
            setIsCameraReady(true);
          }
        }
      } catch (error) {
        console.error("Error checking camera permission:", error);
      }
    };

    initializeCamera();

    // Cleanup function
    return () => {
      mounted = false;
      setIsCameraReady(false);
      // Reset capture state when unmounting
      try {
        useAddItemsStore.getState().resetCapture();
        // Reset label colors to avoid memory leaks
        resetLabelColors();
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    };
  }, []);

  const handleCapture = () => {
    if (cameraRef.current && !isCapturing) {
      addItemsActions.takePicture(cameraRef.current);
    }
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

  const handleSelectLabel = async (label: string) => {
    if (currentBoxId) {
      useAddItemsStore.getState().setLabelForBox(currentBoxId, label);
      // Add to recent labels
      await RecentLabelsManager.addRecentLabel(label);
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
          onPredict={() => addItemsActions.predictBoundingBoxes(capturedImageUri)}
        />

        <RecentLabelsBar
          visible={currentBoxId !== null && !boundingBoxes.find(b => b.id === currentBoxId)?.isComplete}
          onSelectLabel={handleSelectLabel}
        />

        <LabelBottomSheet
          ref={bottomSheetRef}
          onSelectLabel={handleSelectLabel}
        />
      </View>
    );
  }

  // Show camera view only when ready
  if (!isCameraReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Préparation de la caméra...</Text>
      </View>
    );
  }
  
  return (
    <CameraViewComponent
      cameraRef={cameraRef}
      isCapturing={isCapturing}
      onCapture={handleCapture}
      onImport={handleImport}
      flashMode={flashMode}
      onFlashModeChange={setFlashMode}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});
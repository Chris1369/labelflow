import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextStyle,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LabelBottomSheet, LabelBottomSheetRef } from "@/components/organisms";
import { theme } from "@/types/theme";
import { useAddItemsStore } from "./useStore";
import { addItemsActions } from "./actions";
import { useProjectStore } from "@/ui/project/useStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderPage } from "@/components/atoms";
import {
  PermissionView,
  CameraViewComponent,
  CapturedImageView,
  ControlButtons,
  RecentLabelsBar,
  PredictionIndicator,
} from "./components";
import { RecentLabelsManager } from "@/helpers/recentLabels";
import { resetLabelColors } from "@/helpers/labelColors";
import { useProjectDetails } from "@/hooks/queries";

interface AddItemsScreenProps {
  projectId?: string;
  isForUnlabeled?: boolean;
  unlabeledListId?: string;
}

export const AddItemsScreen: React.FC<AddItemsScreenProps> = ({
  projectId: propProjectId,
  isForUnlabeled = false,
  unlabeledListId,
}) => {
  const params = useLocalSearchParams();
  const projectId = propProjectId || (params.id as string);

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
    unlabeledListItems,
    currentUnlabeledIndex,
    isPredicting,
  } = useAddItemsStore();

  const { data: currentProject } = useProjectDetails(projectId);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        if (!mounted) return;

        // Set the mode in the store
        useAddItemsStore.getState().setIsForUnlabeled(isForUnlabeled);
        useAddItemsStore.getState().setCurrentProject(currentProject || null);
        if (isForUnlabeled && unlabeledListId) {
          // Load UnlabeledList items
          await addItemsActions.loadUnlabeledList(unlabeledListId);
        } else {
          // Normal camera mode
          // Add delay to prevent immediate camera access
          await new Promise((resolve) => setTimeout(resolve, 300));

          if (mounted) {
            const hasPermission = await addItemsActions.checkCameraPermission();
            if (!hasPermission && mounted) {
              await addItemsActions.requestCameraPermission();
            }

            // Mark camera as ready after another small delay
            if (mounted) {
              await new Promise((resolve) => setTimeout(resolve, 200));
              setIsCameraReady(true);
            }
          }
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    initialize();

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
  }, [isForUnlabeled, unlabeledListId, currentProject]);

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
    } else if (hasUnknownBoxes) {
      // If there are unknown boxes, select the first one
      const firstUnknownBox = boundingBoxes.find((box) => box.label === "???");
      if (firstUnknownBox) {
        useAddItemsStore.getState().setCurrentBox(firstUnknownBox.id);
        bottomSheetRef.current?.open();
      }
    } else {
      // If in UnlabeledList mode, validate the item and move to next
      if (isForUnlabeled && unlabeledListId) {
        addItemsActions.validateUnlabeledItem(projectId, unlabeledListId);
      } else {
        // Save all items in normal mode
        addItemsActions.saveAllItems(projectId as string);
      }
    }
  };

  const handleSelectLabel = async (label: string) => {
    if (currentBoxId) {
      useAddItemsStore.getState().setLabelForBox(currentBoxId, label);
      // Add to recent labels
      await RecentLabelsManager.addRecentLabel(label);
    }
  };

  const handleDeleteBox = (id: string) => {
    useAddItemsStore.getState().deleteBoundingBox(id);
  };

  const handleEditLabel = (id: string) => {
    useAddItemsStore.getState().setCurrentBox(id);
    bottomSheetRef.current?.open();
  };

  const handleAddBox = () => {
    useAddItemsStore.getState().addBoundingBox();
  };

  const handleSelectBox = (id: string) => {
    useAddItemsStore.getState().setCurrentBox(id);
  };

  const hasCompletedBoxes = boundingBoxes.some((box) => box.isComplete);
  const hasUncompletedBoxes = boundingBoxes.some((box) => !box.isComplete);
  const hasUnknownBoxes = boundingBoxes.some(
    (box) => box.label === "???" || box.label === "Objet non identifié"
  );
  const hasNextImage =
    isForUnlabeled && currentUnlabeledIndex < unlabeledListItems.length - 1;

  const handleNextImage = () => {
    if (hasNextImage) {
      addItemsActions.loadNextUnlabeledImage();
    }
  };

  // Handle permission states - Skip for UnlabeledList mode
  if (!isForUnlabeled && (hasPermission === null || hasPermission === false)) {
    return <PermissionView hasPermission={hasPermission} />;
  }

  // Show captured image with bounding boxes
  if (capturedImageUri) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        {isForUnlabeled && (
          <HeaderPage
            title="Labelliser l'image"
            subtitle={`Image ${currentUnlabeledIndex + 1} sur ${unlabeledListItems.length}`}
          />
        )}
        <View style={isForUnlabeled ? styles.contentWithHeader : styles.container}>
        <CapturedImageView
          capturedImageUri={capturedImageUri}
          boundingBoxes={boundingBoxes}
          currentBoxId={currentBoxId}
          onBoxUpdate={handleBoxUpdate}
          onSelectBox={handleSelectBox}
          onDeleteBox={handleDeleteBox}
          onEditLabel={handleEditLabel}
        />

        <ControlButtons
          currentBoxId={currentBoxId}
          boundingBoxes={boundingBoxes}
          showSaveButton={showSaveButton}
          hasCompletedBoxes={hasCompletedBoxes}
          hasUncompletedBoxes={hasUncompletedBoxes}
          hasUnknownBoxes={hasUnknownBoxes}
          isSaving={isSaving}
          onRetake={addItemsActions.retakePicture}
          onAddBox={handleAddBox}
          onValidate={handleValidate}
          onPredict={() =>
            addItemsActions.predictBoundingBoxes(capturedImageUri)
          }
          isForUnlabeled={isForUnlabeled}
          hasNextImage={hasNextImage}
          onNextImage={handleNextImage}
        />

        {/* Progress indicator removed - now in header */}

        <RecentLabelsBar
          visible={
            currentBoxId !== null &&
            !boundingBoxes.find((b) => b.id === currentBoxId)?.isComplete
          }
          onSelectLabel={handleSelectLabel}
        />

        <LabelBottomSheet
          ref={bottomSheetRef}
          onSelectLabel={handleSelectLabel}
          hasExistingLabel={
            currentBoxId
              ? boundingBoxes.find((b) => b.id === currentBoxId)?.isComplete ??
                false
              : false
          }
          labelCounters={currentProject?.labelCounter || []}
        />
        
        <PredictionIndicator isVisible={isPredicting} />
        </View>
      </SafeAreaView>
    );
  }

  // Show loading state for UnlabeledList mode
  if (isForUnlabeled && unlabeledListItems.length === 0 && !capturedImageUri) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <HeaderPage
          title="Liste vide"
          subtitle="Aucune image à labelliser"
        />
        <View style={styles.emptyListContainer}>
          <Ionicons
            name='images-outline'
            size={80}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.emptyListTitle as TextStyle}>Liste vide</Text>
          <Text style={styles.emptyListText as TextStyle}>
            Cette liste ne contient aucune image à labelliser
          </Text>
          <TouchableOpacity
            style={styles.addImagesButton}
            onPress={() => {
              router.push({
                pathname: "/(project)/[id]/create-list",
                params: {
                  id: projectId,
                  mode: "add",
                  listId: unlabeledListId,
                },
              });
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name='add-circle-outline'
              size={24}
              color={theme.colors.secondary}
            />
            <Text style={styles.addImagesButtonText}>Ajouter des images</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show camera view only when ready (not in UnlabeledList mode)
  if (!isForUnlabeled && !isCameraReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
        <Text style={styles.loadingText as TextStyle}>
          Préparation de la caméra...
        </Text>
      </View>
    );
  }

  // Show camera only in normal mode
  if (!isForUnlabeled) {
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
  }

  // UnlabeledList mode but no image shown yet
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large' color={theme.colors.primary} />
      <Text style={styles.loadingText as TextStyle}>
        Chargement de l'image...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentWithHeader: {
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
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  emptyListTitle: {
    ...theme.fonts.title,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyListText: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  addImagesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  addImagesButtonText: {
    ...theme.fonts.button,
    color: theme.colors.secondary,
  } as TextStyle,
});

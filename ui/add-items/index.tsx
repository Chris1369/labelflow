import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/atoms";
import { StableBoundingBox } from "../../components/molecules";
import { LabelBottomSheet, LabelBottomSheetRef } from "../../components/organisms";
import { theme } from "../../types/theme";
import { useAddItemsStore } from "./useStore";
import { addItemsActions } from "./actions";

export const AddItemsScreen: React.FC = () => {
  const cameraRef = useRef<any>(null);
  const bottomSheetRef = useRef<LabelBottomSheetRef>(null);
  const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });
  const {
    hasPermission,
    capturedImageUri,
    boundingBoxes,
    currentBoxId,
    isCapturing,
    showSaveButton,
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

  const handleRotate = (direction: "left" | "right") => {
    if (!currentBoxId) return;
    const currentBox = boundingBoxes.find(box => box.id === currentBoxId);
    if (!currentBox) return;
    
    const newRotation = currentBox.rotation + (direction === "right" ? 15 : -15);
    useAddItemsStore.getState().updateBoundingBox(currentBoxId, { rotation: newRotation });
  };

  const handleValidate = () => {
    if (currentBoxId) {
      // Validate current box - open label selector
      bottomSheetRef.current?.open();
    } else {
      // Save all items
      addItemsActions.saveAllItems();
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

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPermissionText}>Pas d'accès à la caméra</Text>
        <Button
          title='Demander la permission'
          onPress={addItemsActions.requestCameraPermission}
          style={styles.permissionButton}
        />
      </View>
    );
  }

  if (capturedImageUri) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: capturedImageUri }}
          style={styles.capturedImage}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setImageSize({ width, height });
          }}
        />

        {/* Render all bounding boxes - only if image size is known */}
        {imageSize.width > 0 && imageSize.height > 0 && boundingBoxes.map((box) => (
          <TouchableOpacity
            key={box.id}
            onPress={() => handleSelectBox(box.id)}
            activeOpacity={1}
          >
            <StableBoundingBox
              centerX={box.centerX * imageSize.width}
              centerY={box.centerY * imageSize.height}
              width={box.width * imageSize.width}
              height={box.height * imageSize.height}
              rotation={box.rotation}
              isSelected={box.id === currentBoxId}
              isComplete={box.isComplete}
              onUpdate={(x, y, w, h, r) => handleBoxUpdate(box.id, x / imageSize.width, y / imageSize.height, w / imageSize.width, h / imageSize.height, r)}
            />
            {/* Label display */}
            {box.label && (
              <View 
                style={[
                  styles.labelBadge,
                  {
                    left: (box.centerX * imageSize.width) - (box.width * imageSize.width) / 2,
                    top: (box.centerY * imageSize.height) - (box.height * imageSize.height) / 2 - 30,
                  }
                ]}
              >
                <Text style={styles.labelText}>{box.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Top controls */}
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={addItemsActions.retakePicture}
        >
          <Ionicons
            name='camera-reverse'
            size={32}
            color={theme.colors.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addBoxButton, hasUncompletedBoxes && styles.disabledButton]}
          onPress={handleAddBox}
          disabled={hasUncompletedBoxes}
        >
          <Ionicons
            name='add-circle'
            size={48}
            color={hasUncompletedBoxes ? theme.colors.textSecondary : theme.colors.primary}
          />
        </TouchableOpacity>

        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          {/* Rotation controls - only show if a box is selected */}
          {currentBoxId && (
            <View style={styles.rotationControls}>
              <TouchableOpacity
                style={styles.rotationButton}
                onPress={() => handleRotate("left")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name='refresh-outline'
                  size={20}
                  color={theme.colors.secondary}
                  style={{ transform: [{ scaleX: -1 }] }}
                />
              </TouchableOpacity>
              
              <Text style={styles.rotationText}>
                {boundingBoxes.find(b => b.id === currentBoxId)?.rotation || 0}°
              </Text>
              
              <TouchableOpacity
                style={styles.rotationButton}
                onPress={() => handleRotate("right")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name='refresh-outline'
                  size={20}
                  color={theme.colors.secondary}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Validate button */}
          {showSaveButton && (
            <TouchableOpacity
              style={[
                styles.saveButton,
                hasCompletedBoxes && !currentBoxId && styles.saveAllButton
              ]}
              onPress={handleValidate}
              activeOpacity={0.8}
            >
              <Ionicons
                name={currentBoxId ? 'checkmark-circle' : 'save-outline'}
                size={currentBoxId ? 56 : 32}
                color={hasCompletedBoxes && !currentBoxId ? theme.colors.secondary : theme.colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Box count indicator */}
        {boundingBoxes.length > 0 && (
          <View style={styles.boxCounter}>
            <Text style={styles.boxCounterText}>
              {boundingBoxes.filter(b => b.isComplete).length}/{boundingBoxes.length} objets
            </Text>
          </View>
        )}

        <LabelBottomSheet
          ref={bottomSheetRef}
          onSelectLabel={handleSelectLabel}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing='back'>
        <View style={styles.cameraOverlay}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator color={theme.colors.secondary} />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.secondary,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
  },
  capturedImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  retakeButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addBoxButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rotationControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  rotationButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  rotationText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "bold",
    marginHorizontal: theme.spacing.md,
    minWidth: 40,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 30,
    padding: 4,
  },
  saveAllButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
  },
  noPermissionText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  permissionButton: {
    alignSelf: "center",
  },
  labelBadge: {
    position: "absolute",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  labelText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.xs,
    fontWeight: "600",
  },
  boxCounter: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    left: "50%",
    transform: [{ translateX: -50 }],
  },
  boxCounterText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
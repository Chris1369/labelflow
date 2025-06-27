import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useAddItemsStore } from "./useStore";
import { Alert, Image } from "react-native";
import { projectItemAPI } from "@/api/projectItem.api";
import { router } from "expo-router";
import { resizeImageTo640x640 } from "@/helpers/imageResizer";
import { predictionAPI } from "@/api/prediction.api";

export const addItemsActions = {
  requestCameraPermission: async () => {
    try {
      const { status, canAskAgain } =
        await Camera.requestCameraPermissionsAsync();
      const granted = status === "granted";

      useAddItemsStore.getState().setPermission(granted);
      useAddItemsStore.getState().setPermissionStatus({ granted, canAskAgain });

      if (!granted && !canAskAgain) {
        Alert.alert(
          "Permission refusée",
          "L'accès à la caméra est nécessaire pour ajouter des items. Veuillez activer la permission dans les paramètres de votre appareil.",
          [{ text: "OK" }]
        );
      }

      return granted;
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      return false;
    }
  },

  checkCameraPermission: async () => {
    const { status } = await Camera.getCameraPermissionsAsync();
    const granted = status === "granted";
    useAddItemsStore.getState().setPermission(granted);
    return granted;
  },

  takePicture: async (cameraRef: any) => {
    if (!cameraRef) return;

    // Check if already capturing to prevent multiple captures
    const { isCapturing } = useAddItemsStore.getState();
    if (isCapturing) return;

    try {
      useAddItemsStore.getState().setIsCapturing(true);

      // Add a small delay to ensure camera is ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      const photo = await cameraRef.takePictureAsync({
        quality: 1,
        base64: false,
        skipProcessing: false,
      });

      // Check if photo was taken successfully
      if (!photo || !photo.uri) {
        throw new Error("Photo capture failed");
      }

      // Get image dimensions
      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          Image.getSize(
            photo.uri,
            (w, h) => resolve({ width: w, height: h }),
            (error) => reject(error)
          );
        }
      );

      // Calculate square crop from center
      const smallerDimension = Math.min(dimensions.width, dimensions.height);
      const cropX = (dimensions.width - smallerDimension) / 2;
      const cropY = (dimensions.height - smallerDimension) / 2;

      // Crop to square and resize to 640x640
      const result = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX: Math.round(cropX),
              originY: Math.round(cropY),
              width: Math.round(smallerDimension),
              height: Math.round(smallerDimension),
            },
          },
          { resize: { width: 640, height: 640 } },
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      useAddItemsStore.getState().setCapturedImage(result.uri);
      // Reset capturing state after successful capture
      useAddItemsStore.getState().setIsCapturing(false);
    } catch (error) {
      console.error("Error taking picture:", error);
      // Ensure we reset capturing state even on error
      useAddItemsStore.getState().setIsCapturing(false);

      // Show specific error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Impossible de prendre la photo";
      Alert.alert("Erreur", errorMessage);
    }
  },

  retakePicture: () => {
    try {
      // Force reset isCapturing if needed
      const { isCapturing } = useAddItemsStore.getState();
      if (isCapturing) {
        console.warn("Force resetting isCapturing state");
        useAddItemsStore.getState().setIsCapturing(false);
      }

      useAddItemsStore.getState().resetCapture();
    } catch (error) {
      console.error("Error in retakePicture:", error);
    }
  },

  validateCurrentBox: () => {
    const { currentBoxId } = useAddItemsStore.getState();
    if (currentBoxId) {
      // Will open bottom sheet to select label
      return true;
    }
    return false;
  },

  saveAllItems: async (projectId: string) => {
    const { boundingBoxes, capturedImageUri, setIsSaving } =
      useAddItemsStore.getState();
    const completedBoxes = boundingBoxes.filter((box) => box.isComplete);

    if (completedBoxes.length === 0) {
      Alert.alert(
        "Aucun objet",
        "Veuillez ajouter et valider au moins un objet"
      );
      return;
    }

    setIsSaving(true);

    try {
      console.log("Starting saveAllItems with:", {
        projectId,
        capturedImageUri,
        completedBoxesCount: completedBoxes.length,
      });

      const formData = new FormData();

      // Ensure the image URI is valid
      if (!capturedImageUri) {
        throw new Error("No image URI available");
      }

      formData.append("file", {
        uri: capturedImageUri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("projectId", projectId);
      const labels = completedBoxes.map((box) => {
        // Debug log for each box
        console.log(`Processing box ${box.id}:`, {
          label: box.label,
          centerX: box.centerX,
          centerY: box.centerY,
          width: box.width,
          height: box.height,
          rotation: box.rotation,
          rotationType: typeof box.rotation,
        });

        // Ensure rotation is in proper range (0-360 degrees)
        const normalizedRotation = ((box.rotation % 360) + 360) % 360;

        return {
          name: box.label,
          position: [
            box.centerX.toString(), // X center as percentage
            box.centerY.toString(), // Y center as percentage
            box.width.toString(), // Width as percentage
            box.height.toString(), // Height as percentage
            normalizedRotation.toString(), // Rotation in degrees (0-360)
          ],
        };
      });

      // Validate labels before sending
      for (const label of labels) {
        if (!label.name || label.position.length !== 5) {
          throw new Error(`Invalid label data: ${JSON.stringify(label)}`);
        }

        // Validate position values are numbers
        for (const pos of label.position) {
          if (isNaN(parseFloat(pos))) {
            throw new Error(`Invalid position value: ${pos}`);
          }
        }
      }

      formData.append("labels", JSON.stringify(labels));

      await projectItemAPI.addProjectItems(formData);

      // Reset saving state first
      setIsSaving(false);

      // Small delay to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Afficher un message de succès
      Alert.alert(
        "Succès",
        `${completedBoxes.length} objet${
          completedBoxes.length > 1 ? "s" : ""
        } enregistré${completedBoxes.length > 1 ? "s" : ""}`,
        [
          {
            text: "Continuer",
            onPress: async () => {
              try {
                // Small delay before reset to avoid state conflicts
                await new Promise((resolve) => setTimeout(resolve, 100));
                // Réinitialiser pour permettre de capturer une nouvelle image
                useAddItemsStore.getState().resetCapture();
              } catch (error) {
                console.error("Error in Continue action:", error);
              }
            },
          },
          {
            text: "Terminer",
            onPress: async () => {
              try {
                // Reset state before navigation
                useAddItemsStore.getState().resetCapture();
                // Longer delay before navigation to ensure cleanup
                await new Promise((resolve) => setTimeout(resolve, 300));
                // Retourner à la page précédente
                router.back();
              } catch (error) {
                console.error("Error in Finish action:", error);
              }
            },
            style: "cancel",
          },
        ]
      );
    } catch (error: any) {
      console.error("Error saving items:", error);
      setIsSaving(false);

      // Log detailed error information
      const errorDetails = {
        message: error.message || "Unknown error",
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      };

      console.error("Error details:", JSON.stringify(errorDetails, null, 2));

      // Show more detailed error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Impossible d'enregistrer les objets";

      Alert.alert("Erreur", errorMessage);
    }
  },

  updateBoxPosition: (id: string, centerX: number, centerY: number) => {
    // centerX and centerY should already be relative values (0-1)
    useAddItemsStore.getState().updateBoundingBox(id, { centerX, centerY });
  },

  updateBoxSize: (id: string, width: number, height: number) => {
    // width and height should already be relative values (0-1)
    useAddItemsStore.getState().updateBoundingBox(id, { width, height });
  },

  updateBoxRotation: (id: string, rotation: number) => {
    useAddItemsStore.getState().updateBoundingBox(id, { rotation });
  },

  importFromGallery: async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la galerie est nécessaire pour importer des images.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Force square aspect ratio
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        // Resize image to 640x640
        const resizedUri = await resizeImageTo640x640(result.assets[0].uri);
        useAddItemsStore.getState().setCapturedImage(resizedUri);
      }
    } catch (error) {
      console.error("Error importing image:", error);
      Alert.alert("Erreur", "Impossible d'importer l'image");
    }
  },

  predictBoundingBoxes: async (imageUri: string) => {
    try {
      console.log("Starting prediction for image:", imageUri);
      
      // Call prediction API
      const response = await predictionAPI.predict(imageUri);
      console.log("Prediction response:", response);
      
      // Process detections if any
      if (response.detections && response.detections.length > 0) {
        const store = useAddItemsStore.getState();
        
        // Clear existing boxes and prepare for new ones
        const newBoundingBoxes: any[] = [];
        
        // Process predicted boxes
        response.detections.forEach((detection, index) => {
          // Convert API bbox format (x1,y1,x2,y2) to our format (centerX, centerY, width, height in 0-1 range)
          const width = detection.bbox.x2 - detection.bbox.x1;
          const height = detection.bbox.y2 - detection.bbox.y1;
          const centerX = (detection.bbox.x1 + width / 2) / response.image_size.width;
          const centerY = (detection.bbox.y1 + height / 2) / response.image_size.height;
          const normalizedWidth = width / response.image_size.width;
          const normalizedHeight = height / response.image_size.height;
          
          console.log(`Detection ${index + 1} - ${detection.label}:`, {
            original: {
              x1: detection.bbox.x1,
              y1: detection.bbox.y1,
              x2: detection.bbox.x2,
              y2: detection.bbox.y2,
            },
            calculated: {
              centerX: centerX.toFixed(4),
              centerY: centerY.toFixed(4),
              width: normalizedWidth.toFixed(4),
              height: normalizedHeight.toFixed(4),
            },
            debug: {
              width_px: width,
              height_px: height,
              center_x_px: detection.bbox.x1 + width / 2,
              center_y_px: detection.bbox.y1 + height / 2,
            },
            imageSize: response.image_size,
          });
          
          // Create new box with prediction data
          const newBox = {
            id: `pred_${Date.now()}_${index}`,
            centerX,
            centerY,
            width: normalizedWidth,
            height: normalizedHeight,
            rotation: 0,
            label: detection.label,
            isComplete: true,
          };
          
          newBoundingBoxes.push(newBox);
        });
        
        // Update store with all new boxes at once
        store.setBoundingBoxes(newBoundingBoxes);
        
        Alert.alert(
          "Prédiction terminée",
          `${response.detections.length} objet${response.detections.length > 1 ? 's' : ''} détecté${response.detections.length > 1 ? 's' : ''}`
        );
      } else {
        Alert.alert("Aucun objet détecté", "La prédiction n'a trouvé aucun objet dans l'image.");
      }
    } catch (error) {
      console.error("Error in predictBoundingBoxes:", error);
      Alert.alert("Erreur", "Impossible d'effectuer la prédiction. Vérifiez que le serveur est en ligne.");
    }
  },
};

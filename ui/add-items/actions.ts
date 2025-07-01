import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useAddItemsStore } from "./useStore";
import { Alert, Image } from "react-native";
import { projectItemAPI } from "@/api/projectItem.api";
import { router } from "expo-router";
import { resizeImageTo640x640 } from "@/helpers/imageResizer";
import { predictionAPI } from "@/api/prediction.api";
import { trainingAnnotationAPI } from "@/api/trainingAnnotation.api";
import { unlabeledListAPI } from "@/api/unlabeledList.api";
import { useProjectStore } from "@/ui/project/useStore";

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
    const { boundingBoxes, capturedImageUri,currentProject, setIsSaving, generateObjectItemTrainingId } =
      useAddItemsStore.getState();
    const completedBoxes = boundingBoxes.filter((box) => box.isComplete);
    const objectItemTrainingId = generateObjectItemTrainingId();

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
      formData.append("objectItemTrainingId", objectItemTrainingId as string);
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

      // Send annotations for training (fire and forget - don't wait for response)
      try {
        // Get project name from the project store
        const projectName = currentProject?.name || 'Unknown Project';
        
        // Get image dimensions (we know it's 640x640 from resizing)
        const imageWidth = 640;
        const imageHeight = 640;
        
        // Convert bounding boxes to training format
        const annotations = trainingAnnotationAPI.convertBoundingBoxFormat(
          completedBoxes.map(box => ({
            centerX: box.centerX,
            centerY: box.centerY,
            width: box.width,
            height: box.height,
            label: box.label || 'unknown',
          }))
        );
        
        // Send annotations asynchronously (don't await)
        trainingAnnotationAPI.sendAnnotations(
          capturedImageUri,
          imageWidth,
          imageHeight,
          annotations,
          projectName,
          objectItemTrainingId as string
        ).then(() => {
          console.log('Training annotations sent successfully');
        }).catch(error => {
          console.error('Failed to send training annotations:', error);
          // Don't show error to user - training is optional
        });
      } catch (error) {
        console.error('Error preparing training annotations:', error);
        // Don't fail the save operation
      }

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
                // generer un nouvel objectItemTrainingId
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

  loadUnlabeledList: async (listId: string) => {
    try {
      const store = useAddItemsStore.getState();
      
      console.log("Loading unlabeled list with ID:", listId);
      
      // Load the unlabeled list
      const response = await unlabeledListAPI.getById(listId);
      console.log("Unlabeled list response:", response);
      
      // The response is the data directly, not wrapped in { data: ... }
      const list = response;
      console.log("List items:", list.items);
      
      store.setUnlabeledListData(list.items || [], listId);
      
      // Load the first image if available
      if (list.items && list.items.length > 0) {
        const firstItem = list.items[0];
        console.log("First item:", firstItem);
        
        // Use fileUrl field
        const imageUrl = firstItem.fileUrl;
        console.log("Image URL found:", imageUrl);
        
        if (imageUrl) {
          console.log("Setting first image URL:", imageUrl);
          store.setCurrentUnlabeledImage(imageUrl);
        } else {
          console.error("No fileUrl found in item:", firstItem);
        }
      } else {
        console.log("List is empty, showing add images interface");
        // List is empty, the UI will show the add images button
      }
    } catch (error) {
      console.error("Error loading unlabeled list:", error);
      Alert.alert("Erreur", "Impossible de charger la liste");
    }
  },

  loadNextUnlabeledImage: () => {
    const store = useAddItemsStore.getState();
    const { currentUnlabeledIndex, unlabeledListItems } = store;
    
    const nextIndex = currentUnlabeledIndex + 1;
    
    if (nextIndex < unlabeledListItems.length) {
      store.setCurrentUnlabeledIndex(nextIndex);
      const nextItem = unlabeledListItems[nextIndex];
      console.log("Loading next item:", nextItem);
      
      // Use fileUrl field
      const imageUrl = nextItem.fileUrl;
      
      if (imageUrl) {
        store.setCurrentUnlabeledImage(imageUrl);
      } else {
        console.error("No fileUrl found in next item:", nextItem);
      }
    }
  },

  validateUnlabeledItem: async (projectId: string, listId: string) => {
    const store = useAddItemsStore.getState();
    const { boundingBoxes, currentUnlabeledIndex, unlabeledListItems, setIsSaving , generateObjectItemTrainingId, currentProject} = store;
    
    if (!boundingBoxes.length || !listId) return;

    const objectItemTrainingId = generateObjectItemTrainingId();
    
    try {
      setIsSaving(true);
      
      // Get current item
      const currentItem = unlabeledListItems[currentUnlabeledIndex];
      if (!currentItem || !currentItem._id) {
        throw new Error("No current item found");
      }
      
      // Prepare labels with positions
      const labels = boundingBoxes
        .filter(box => box.isComplete && box.label)
        .map(box => ({
          name: box.label!,
          position: [box.centerX, box.centerY, box.width, box.height, box.rotation],
        }));
      
      if (labels.length === 0) {
        Alert.alert("Erreur", "Veuillez ajouter au moins un label");
        setIsSaving(false);
        return;
      }
      
      // Call validate API
      const response = await unlabeledListAPI.validateItem(listId, currentItem._id, {
        projectId,
        labels,
        objectItemTrainingId: objectItemTrainingId as string
      });
      
      console.log("Validate response:", response);
      
      // Check if validation was successful (response exists and no error)
      if (response && response.projectItem) {
        // Send training annotations (fire and forget - don't wait for response)
        try {
          // Get project name from the project store
          const projectName = currentProject?.name || 'Unknown Project';
          
          // Get current image URL
          const currentImageUrl = currentItem.fileUrl;
          
          if (currentImageUrl) {
            // Get image dimensions (we know it's 640x640 from resizing)
            const imageWidth = 640;
            const imageHeight = 640;
            
            // Convert bounding boxes to training format
            const annotations = trainingAnnotationAPI.convertBoundingBoxFormat(
              boundingBoxes
                .filter(box => box.isComplete && box.label)
                .map(box => ({
                  centerX: box.centerX,
                  centerY: box.centerY,
                  width: box.width,
                  height: box.height,
                  label: box.label || 'unknown',
                }))
            );
            
            // Send annotations asynchronously (don't await)
            trainingAnnotationAPI.sendAnnotations(
              currentImageUrl,
              imageWidth,
              imageHeight,
              annotations,
              projectName,
              objectItemTrainingId as string
            ).then(() => {
              console.log('Training annotations sent successfully for validated item');
            }).catch(error => {
              console.error('Failed to send training annotations:', error);
              // Don't show error to user - training is optional
            });
          }
        } catch (error) {
          console.error('Error preparing training annotations:', error);
          // Don't fail the validation operation
        }
        
        // Remove the validated item from the local list
        const updatedItems = [...unlabeledListItems];
        updatedItems.splice(currentUnlabeledIndex, 1);
        store.setUnlabeledListData(updatedItems, listId);
        
        // Check if there are more items
        if (updatedItems.length > 0) {
          // If we're at the end of the list, go back to the previous item
          const newIndex = currentUnlabeledIndex >= updatedItems.length ? updatedItems.length - 1 : currentUnlabeledIndex;
          
          // Load the image at the current index (which is now the next item since we removed one)
          const nextItem = updatedItems[newIndex];
          if (nextItem && nextItem.fileUrl) {
            // Reset bounding boxes before loading next image
            store.resetBoundingBoxes();
            store.setCurrentUnlabeledImage(nextItem.fileUrl);
            // Update the index if necessary
            if (newIndex !== currentUnlabeledIndex) {
              store.setCurrentUnlabeledIndex(newIndex);
            }
          }
        } else {
          // All items processed
          Alert.alert(
            "Liste complétée", 
            "Tous les items ont été labellisés.",
            [
              {
                text: "OK",
                onPress: () => router.back(),
              }
            ]
          );
        }
      }
      
      setIsSaving(false);
    } catch (error: any) {
      console.error("Error validating item:", error);
      setIsSaving(false);
      Alert.alert("Erreur", error.response?.data?.message || "Impossible de valider l'item");
    }
  },

  openImagePicker: async (listId: string) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la galerie est nécessaire pour ajouter des images.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const store = useAddItemsStore.getState();
        store.setIsSaving(true);
        
        try {
          // Create FormData with multiple images
          const formData = new FormData();
          
          for (let i = 0; i < result.assets.length; i++) {
            const asset = result.assets[i];
            const resizedUri = await resizeImageTo640x640(asset.uri);
            
            formData.append('images', {
              uri: resizedUri,
              name: `image_${i}.jpg`,
              type: 'image/jpeg',
            } as any);
          }

          // Add images to the unlabeled list
          const response = await unlabeledListAPI.addImages(listId, formData);
          
          if (response.success) {
            Alert.alert(
              "Images ajoutées",
              `${result.assets.length} image(s) ont été ajoutées à la liste.`,
              [
                {
                  text: "OK",
                  onPress: () => {
                    // Reload the list to show the new images
                    addItemsActions.loadUnlabeledList(listId);
                  }
                }
              ]
            );
          }
        } catch (error) {
          console.error("Error adding images to list:", error);
          Alert.alert("Erreur", "Impossible d'ajouter les images");
        } finally {
          store.setIsSaving(false);
        }
      }
    } catch (error) {
      console.error("Error opening image picker:", error);
      Alert.alert("Erreur", "Impossible d'ouvrir la galerie");
    }
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
      
      // Check if it's a URL (starts with http:// or https://)
      const isUrl = imageUri.startsWith('http://') || imageUri.startsWith('https://');
      
      // Call prediction API with appropriate method
      const response = await predictionAPI.predict(imageUri, isUrl);
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
            label: detection.confidence < 0.7 ? "???" : detection.label,
            isComplete: true,  // Always mark as complete, even for ??? boxes
          };
          
          newBoundingBoxes.push(newBox);
        });
        
        // Update store with all new boxes at once
        store.setBoundingBoxes(newBoundingBoxes);
        
        // Auto-select first unknown box if any
        const firstUnknownBox = newBoundingBoxes.find(box => box.label === "???");
        if (firstUnknownBox) {
          store.setCurrentBox(firstUnknownBox.id);
        }
        
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

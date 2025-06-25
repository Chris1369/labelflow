import { Camera } from 'expo-camera';
import { useAddItemsStore } from './useStore';
import { Alert } from 'react-native';
import { projectItemAPI } from '@/api/projectItem.api';
import { router } from 'expo-router';

export const addItemsActions = {
  requestCameraPermission: async () => {
    try {
      const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
      const granted = status === 'granted';
      
      useAddItemsStore.getState().setPermission(granted);
      useAddItemsStore.getState().setPermissionStatus({ granted, canAskAgain });
      
      if (!granted && !canAskAgain) {
        Alert.alert(
          'Permission refusée',
          "L'accès à la caméra est nécessaire pour ajouter des items. Veuillez activer la permission dans les paramètres de votre appareil.",
          [{ text: 'OK' }]
        );
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  },

  checkCameraPermission: async () => {
    const { status } = await Camera.getCameraPermissionsAsync();
    const granted = status === 'granted';
    useAddItemsStore.getState().setPermission(granted);
    return granted;
  },

  takePicture: async (cameraRef: any) => {
    if (!cameraRef) return;
    
    try {
      useAddItemsStore.getState().setIsCapturing(true);
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      useAddItemsStore.getState().setCapturedImage(photo.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    } finally {
      useAddItemsStore.getState().setIsCapturing(false);
    }
  },

  retakePicture: () => {
    useAddItemsStore.getState().resetCapture();
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
    const { boundingBoxes, capturedImageUri } = useAddItemsStore.getState();
    const completedBoxes = boundingBoxes.filter((box) => box.isComplete);

    if (completedBoxes.length === 0) {
      Alert.alert('Aucun objet', 'Veuillez ajouter et valider au moins un objet');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: capturedImageUri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("projectId", projectId);
      formData.append("labels", JSON.stringify(completedBoxes.map((box) => ({
        name: box.label,
        position: [
          box.centerX.toFixed(4), // X center as percentage
          box.centerY.toFixed(4), // Y center as percentage
          box.width.toFixed(4), // Width as percentage
          box.height.toFixed(4), // Height as percentage
        ],
      }))));

      await projectItemAPI.addProjectItems(formData);
      
      // Afficher un message de succès
      Alert.alert(
        'Succès',
        `${completedBoxes.length} objet${completedBoxes.length > 1 ? 's' : ''} enregistré${completedBoxes.length > 1 ? 's' : ''}`,
        [
          {
            text: 'Continuer',
            onPress: () => {
              // Réinitialiser pour permettre de capturer une nouvelle image
              useAddItemsStore.getState().resetCapture();
            }
          },
          {
            text: 'Terminer',
            onPress: () => {
              // Retourner à la page précédente
              router.back();
            },
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error saving items:', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer les objets');
    }
  },

  updateBoxPosition: (centerX: number, centerY: number) => {
    // centerX and centerY should already be relative values (0-1)
    useAddItemsStore.getState().updateBoundingBox({ centerX, centerY });
  },

  updateBoxSize: (width: number, height: number) => {
    // width and height should already be relative values (0-1)
    useAddItemsStore.getState().updateBoundingBox({ width, height });
  },

  updateBoxRotation: (rotation: number) => {
    useAddItemsStore.getState().updateBoundingBox({ rotation });
  },
};
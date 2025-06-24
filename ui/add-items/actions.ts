import { Camera } from 'expo-camera';
import { useAddItemsStore } from './useStore';
import { Alert } from 'react-native';

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

  saveAllItems: () => {
    useAddItemsStore.getState().saveAllItems();
    // TODO: Navigate back or show success message
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
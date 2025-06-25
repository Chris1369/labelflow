import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
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
    const { boundingBoxes, capturedImageUri, setIsSaving } = useAddItemsStore.getState();
    const completedBoxes = boundingBoxes.filter((box) => box.isComplete);

    if (completedBoxes.length === 0) {
      Alert.alert('Aucun objet', 'Veuillez ajouter et valider au moins un objet');
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: capturedImageUri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("projectId", projectId);
      const labels = completedBoxes.map((box) => {
        // Log les valeurs brutes avec toute leur précision
        console.log(`Box ${box.label} - Valeurs brutes:`, {
          centerX: box.centerX,
          centerY: box.centerY,
          width: box.width,
          height: box.height,
          rotation: box.rotation,
          centerX_string: box.centerX.toString(),
          centerY_string: box.centerY.toString(),
          centerX_precision: box.centerX.toPrecision(20),
          centerY_precision: box.centerY.toPrecision(20)
        });
        return {
          name: box.label,
          position: [
            box.centerX.toString(), // X center as percentage
            box.centerY.toString(), // Y center as percentage
            box.width.toString(), // Width as percentage
            box.height.toString(), // Height as percentage
            box.rotation.toString(), // Rotation in degrees
          ],
        };
      });
      console.log('Labels to send:', JSON.stringify(labels, null, 2));
      formData.append("labels", JSON.stringify(labels));

      await projectItemAPI.addProjectItems(formData);
      
      setIsSaving(false);
      
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
      setIsSaving(false);
      Alert.alert('Erreur', 'Impossible d\'enregistrer les objets');
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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'L\'accès à la galerie est nécessaire pour importer des images.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        useAddItemsStore.getState().setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error importing image:', error);
      Alert.alert('Erreur', 'Impossible d\'importer l\'image');
    }
  },
};
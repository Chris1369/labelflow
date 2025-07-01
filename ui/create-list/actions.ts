import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useStore } from './useStore';
import { unlabeledListAPI } from '@/api/unlabeledList.api';
import { createSafeAction } from '@/helpers/safeAction';

export const createListActions = {
  setListName: (name: string) => {
    useStore.getState().setListName(name);
  },

  setError: (error: string | null) => {
    useStore.getState().setError(error);
  },

  removeImage: (index: number) => {
    const store = useStore.getState();
    const newImages = [...store.selectedImages];
    newImages.splice(index, 1);
    store.setSelectedImages(newImages);
  },

  loadExistingList: async (listId: string) => {
    try {
      const response = await unlabeledListAPI.getById(listId);
      if (response) {
        useStore.getState().setListName(response.name || 'Liste sans nom');
      }
    } catch (error) {
      console.error('Error loading list:', error);
    }
  },

  addImagesToList: (listId: string, projectId: string) => addImagesToList(listId, projectId),

  createList: (projectId: string) => createList(projectId),

  selectImages: async (projectId: string) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'L\'accès à la galerie est nécessaire pour ajouter des images.',
          [{ text: 'OK' }]
        );
        return;
      }

      const store = useStore.getState();
      const { autoCrop } = store;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: !autoCrop, // Allow manual editing only when autoCrop is disabled
        aspect: !autoCrop ? [1, 1] : undefined, // Force square aspect ratio for manual crop
        quality: 1,
        allowsMultipleSelection: autoCrop, // Enable multi-select when autoCrop is enabled
      });

      if (!result.canceled && result.assets.length > 0) {
        const currentImages = store.selectedImages;
        const newImages: string[] = [];

        // Process each selected image
        for (const asset of result.assets) {
          let finalUri = asset.uri;
          
          // Process the image based on autoCrop setting
          if (autoCrop) {
            // Automatically crop and resize to 640x640
            const { width, height } = asset;
            
            // Calculate crop to center square
            const cropSize = Math.min(width, height);
            const cropX = (width - cropSize) / 2;
            const cropY = (height - cropSize) / 2;
            
            const manipResult = await ImageManipulator.manipulateAsync(
              asset.uri,
              [
                {
                  crop: {
                    originX: cropX,
                    originY: cropY,
                    width: cropSize,
                    height: cropSize
                  }
                },
                { resize: { width: 640, height: 640 } }
              ],
              { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            finalUri = manipResult.uri;
          } else {
            // Manual crop was already done by the user, just resize to 640x640
            const manipResult = await ImageManipulator.manipulateAsync(
              asset.uri,
              [
                { resize: { width: 640, height: 640 } }
              ],
              { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            finalUri = manipResult.uri;
          }
          
          newImages.push(finalUri);
        }

        // Store all processed images
        store.setSelectedImages([...currentImages, ...newImages]);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  },
};


const createList = createSafeAction(
  async (projectId: string) => {
    const { listName, selectedImages, setIsCreating } = useStore.getState();
    
    if (selectedImages.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins une image');
      return;
    }
    
    setIsCreating(true);

    try {
      const formData = new FormData();
      formData.append('name', listName.trim());
      formData.append('projectId', projectId);
      
      // Append all images - l'API attend 'images' et non 'files'
      selectedImages.forEach((imageUri, index) => {
        formData.append('images', {
          uri: imageUri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      });

      // Create the unlabeled list
      const response = await unlabeledListAPI.create(formData);

      // Reset store
      useStore.getState().reset();

      // Navigate to the list
      const listId = response.id || response._id;
      router.replace(`/(project)/${projectId}/label-list?listId=${listId}`);
      
    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  },
  {
    showAlert: true,
    alertTitle: 'Erreur',
    componentName: 'CreateList',
  }
);

const addImagesToList = createSafeAction(
  async (listId: string, projectId: string) => {
    const store = useStore.getState();
    const { selectedImages, setIsCreating } = store;

    if (selectedImages.length === 0) {
      throw new Error('Aucune image sélectionnée');
    }

    setIsCreating(true);

    try {
      const formData = new FormData();
      
      // Append all images
      selectedImages.forEach((imageUri, index) => {
        formData.append('images', {
          uri: imageUri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      });

      // Add images to existing list
      await unlabeledListAPI.addImages(listId, formData);

      // Reset store
      useStore.getState().reset();

      // Navigate back to label-list
      router.replace(`/(project)/${projectId}/label-list?listId=${listId}`);
      
    } catch (error) {
      console.error('Error adding images to list:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  },
  {
    showAlert: true,
    alertTitle: 'Erreur',
    alertMessage: 'Impossible d\'ajouter les images à la liste',
    componentName: 'AddToList',
  }
);
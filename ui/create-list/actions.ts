import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useStore } from './useStore';
import { unlabeledListAPI } from '@/api/unlabeledList.api';
import { createSafeAction } from '@/helpers/safeAction';
import { CAPTURE_TEMPLATES } from '@/constants/CapturesTemplates';

export const createListActions = {
  setListName: (name: string) => {
    useStore.getState().setListName(name);
  },

  setListImageTemplate: (template: string) => {
    useStore.getState().setListImageTemplate(template);
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

        //init existing validated images by angle
        const images: Record<string, string[]> = {};
        response.validatedItems?.forEach((item: any) => {
          if (item.angle) {
            images[item.angle] = [...(images[item.angle] || []), item.fileUrl];
          }
        });

        useStore.getState().setExistingValidatedImagesByAngle(images);
        useStore.getState().setListImageTemplate(response.pictureTemplateId);
      }
    } catch (error) {
      console.error('Error loading list:', error);
    }
  },

  addImagesToList: (listId: string, projectId: string) =>
    addImagesToList(listId, projectId),

  createList: (projectId: string) => createList(projectId),

  //create liste for image template
  createListWithPictureTempleAngles: (projectId: string) =>
    createListWithPictureTempleAngles(projectId),

  addImagesToListByAngle: (listId: string, projectId: string) =>
    addImagesToListByAngle(listId, projectId),

  selectImages: async (params?: {angle?: string, source?: 'camera' | 'gallery'}) => {
    console.log('selectImages called with params:', params);
    try {
      // Request appropriate permissions
      if (params?.source === 'camera') {
        console.log('Requesting camera permissions...');
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission refusée',
            "L'accès à la caméra est nécessaire pour prendre des photos.",
            [{ text: 'OK' }]
          );
          return;
        }
      } else {
        console.log('Requesting media library permissions...');
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission refusée',
            "L'accès à la galerie est nécessaire pour ajouter des images.",
            [{ text: 'OK' }]
          );
          return;
        }
      }

      const store = useStore.getState();
      const { autoCrop, setIsSelectingImages, setProcessingProgress } = store;
      
      // Ensure we start with a clean state
      setIsSelectingImages(true);
      setProcessingProgress(0, 0, 0);

      console.log('Launching picker with source:', params?.source);
      console.log('Auto crop enabled:', autoCrop);
      
      let result;
      
      try {
        if (params?.source === 'camera') {
          console.log('About to launch camera with options:', {
            allowsEditing: !autoCrop,
            aspect: !autoCrop ? [1, 1] : undefined,
            quality: 1,
          });
          
          result = await ImagePicker.launchCameraAsync({
            allowsEditing: !autoCrop,
            aspect: !autoCrop ? [1, 1] : undefined,
            quality: 1,
          });
        } else {
          console.log('About to launch gallery with options:', {
            allowsEditing: !autoCrop,
            aspect: !autoCrop ? [1, 1] : undefined,
            quality: 1,
            allowsMultipleSelection: autoCrop,
          });
          
          result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: !autoCrop,
            aspect: !autoCrop ? [1, 1] : undefined,
            quality: 1,
            allowsMultipleSelection: autoCrop,
          });
        }
        
        console.log('Image picker returned with result:', result);
      } catch (pickerError) {
        console.error('Error launching picker:', pickerError);
        throw pickerError;
      }
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Processing', result.assets.length, 'images...');
        
        // Update total images for progress
        setProcessingProgress(0, 0, result.assets.length);

        const currentImages = store.selectedImages;
        const newImages: string[] = [];

        // Process each selected image
        for (let index = 0; index < result.assets.length; index++) {
          const asset = result.assets[index];
          
          // Update progress
          const progress = ((index + 1) / result.assets.length) * 100;
          setProcessingProgress(progress, index + 1, result.assets.length);
          
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
                    height: cropSize,
                  },
                },
                { resize: { width: 640, height: 640 } },
              ],
              { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            finalUri = manipResult.uri;
          } else {
            // Manual crop was already done by the user, just resize to 640x640
            const manipResult = await ImageManipulator.manipulateAsync(
              asset.uri,
              [{ resize: { width: 640, height: 640 } }],
              { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            finalUri = manipResult.uri;
          }

          newImages.push(finalUri);
        }

        // Store all processed images
        if (params?.angle) {
          // add image by angle
          store.addImagesByAngle(params.angle, newImages);
        }else{
          // add image without angle
          store.setSelectedImages([...currentImages, ...newImages]);
        }
      } else {
        console.log('Image picker cancelled or no images selected');
      }
      
      // Always hide loader
      setIsSelectingImages(false);
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Erreur', "Impossible de sélectionner l'image");
      useStore.getState().setIsSelectingImages(false);
    }
  },
  removeImageByAngle: (angle: string, index: number) => {
    const store = useStore.getState();
    const images = store.selectedImagesByAngle[angle];

    if (!images || index < 0 || index >= images.length) return;

    const newImages = [...images];
    newImages.splice(index, 1);
    store.setSelectedImagesByAngle(angle, newImages);
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
      formData.append('projectId', projectId);
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
    alertMessage: "Impossible d'ajouter les images à la liste",
    componentName: 'AddToList',
  }
);

// create list with picture temple angles
const createListWithPictureTempleAngles = createSafeAction(
  async (projectId: string) => {
    const {
      listName,
      selectedImagesByAngle,
      setIsCreating,
      listImageTemplate,
    } = useStore.getState();

    const selectedImageTemplateData = CAPTURE_TEMPLATES.find(
      (template) => template.id === listImageTemplate
    );

    if (Object.values(selectedImagesByAngle).flat().length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins une image');
      return;
    }

    setIsCreating(true);

    try {
      const formData = new FormData();
      formData.append('name', listName.trim());
      formData.append('projectId', projectId);
      formData.append('pictureTemplateId', listImageTemplate);

      if (selectedImageTemplateData) {
        formData.append(
          'totalRequiredValidatedItems',
          selectedImageTemplateData.totalPhotos.toString()
        );
      }

      Object.entries(selectedImagesByAngle).forEach(([angle, images]) => {
        images.forEach((imageUri, index) => {
          formData.append('images', {
            uri: imageUri,
            name: `${angle}___image_${index}.jpg`, // using ___ to identify the angle
            type: 'image/jpeg',
          } as any);
        });
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


// add images to existing list
const addImagesToListByAngle = createSafeAction(
  async (listId: string, projectId: string) => {
    const store = useStore.getState();
    const { selectedImagesByAngle, setIsCreating } = store;

    if (Object.values(selectedImagesByAngle).flat().length === 0) {
      throw new Error('Aucune image sélectionnée');
    }

    setIsCreating(true);

    try {
      const formData = new FormData();
      formData.append('projectId', projectId);

      // Append all images
      Object.entries(selectedImagesByAngle).forEach(([angle, images]) => {
        images.forEach((imageUri, index) => {
        formData.append('images', {
          uri: imageUri,
            name: `${angle}___image_${index}.jpg`, // using ___ to identify the angle
            type: 'image/jpeg',
          } as any);
        });
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
    alertMessage: "Impossible d'ajouter les images à la liste",
    componentName: 'AddToList',
  }
);
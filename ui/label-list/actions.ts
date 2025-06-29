import { unlabeledListAPI } from '@/api/unlabeledList.api';
import { projectItemAPI } from '@/api/projectItem.api';
import { trainingAnnotationAPI } from '@/api/trainingAnnotation.api';
import { useLabelListStore } from './useStore';
import { createSafeAction } from '@/helpers/safeAction';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export const labelListActions = {
  addNewBox: () => {
    const store = useLabelListStore.getState();
    const newBox = {
      id: `box_${Date.now()}`,
      centerX: 0.5,
      centerY: 0.5,
      width: 0.3,
      height: 0.3,
      rotation: 0,
      label: undefined,
      isComplete: false,
    };
    store.addBoundingBox(newBox);
  },

  loadList: createSafeAction(
    async (listId: string) => {
      const store = useLabelListStore.getState();
      store.setIsLoading(true);

      try {
        const list = await unlabeledListAPI.getById(listId);
        store.setCurrentList(list);

        // Load first image if available
        if (list.items && list.items.length > 0) {
          store.setCurrentItemIndex(0);
          store.setCurrentImageUrl(list.items[0].imageUrl);
        }
      } finally {
        store.setIsLoading(false);
      }
    },
    {
      showAlert: true,
      componentName: 'LabelList',
    }
  ),

  setLabelForCurrentBox: (label: string) => {
    const store = useLabelListStore.getState();
    const { currentBoxId } = store;
    
    if (currentBoxId) {
      store.updateBoundingBox(currentBoxId, {
        label,
        isComplete: true,
      });
      
      // Auto-select next unlabeled box
      const nextBox = store.boundingBoxes.find(box => !box.isComplete && box.id !== currentBoxId);
      if (nextBox) {
        store.setCurrentBoxId(nextBox.id);
      } else {
        store.setCurrentBoxId(null);
      }
    }
  },

  validateItemWithLabels: createSafeAction(
    async (listId: string, projectId: string) => {
      const store = useLabelListStore.getState();
      const { currentList, currentItemIndex, boundingBoxes, currentImageUrl } = store;
      
      if (!currentList || !currentList.items || !currentImageUrl) return;
      
      const currentItem = currentList.items[currentItemIndex];
      const itemId = currentItem.id || currentItem._id;
      
      if (!itemId) return;
      
      // Check if all boxes have labels
      const completedBoxes = boundingBoxes.filter(box => box.isComplete);
      if (completedBoxes.length === 0) {
        Alert.alert('Erreur', 'Veuillez ajouter au moins un objet labellisé');
        return;
      }
      
      store.setIsSaving(true);
      
      try {
        // Create FormData
        const formData = new FormData();
        formData.append('projectId', projectId);
        
        // Convert bounding boxes to labels format
        const labels = completedBoxes.map(box => ({
          name: box.label || 'unknown',
          position: [
            box.centerX.toString(),
            box.centerY.toString(),
            box.width.toString(),
            box.height.toString(),
            box.rotation.toString(),
          ],
        }));
        
        formData.append('labels', JSON.stringify(labels));
        
        // Since the image is from S3, we need to include the URL
        formData.append('imageUrl', currentImageUrl);
        
        // Validate the item
        await unlabeledListAPI.validateItem(listId, itemId);
        
        // Send training annotations if image is local
        if (!currentImageUrl.startsWith('http')) {
          try {
            const annotations = trainingAnnotationAPI.convertBoundingBoxFormat(
              completedBoxes.map(box => ({
                centerX: box.centerX,
                centerY: box.centerY,
                width: box.width,
                height: box.height,
                label: box.label || 'unknown',
              }))
            );
            
            await trainingAnnotationAPI.sendAnnotations(
              currentImageUrl,
              640, // We know images are 640x640
              640,
              annotations
            );
          } catch (error) {
            console.warn('Failed to send training annotations:', error);
          }
        }
        
        // Remove the validated item from the list
        store.removeValidatedItem(itemId);
        
        // Check if there are more items
        const remainingItems = (store.currentList?.items?.length || 0) - 1;
        if (remainingItems === 0) {
          Alert.alert(
            'Liste terminée',
            'Toutes les images ont été labellisées.',
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        }
      } finally {
        store.setIsSaving(false);
      }
    },
    {
      showAlert: true,
      componentName: 'LabelList',
    }
  ),
};
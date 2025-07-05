import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  InteractionManager,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/types/theme';
import { useStore } from './useStore';
import { createListActions } from './actions';
import { HeaderPage } from '@/components/atoms';
import {
  ListNameInput,
  AddModeInfo,
  ImageGrid,
  EmptyImageCard,
  BottomActionButton,
  AutoCropToggle,
  ProcessingOverlay,
} from './components';
import { ListImageTemplateSelect } from './components/ListImageTemplateSelect';
import { PictureTempleAngles } from './components/PictureTempleAngles';

interface CreateListScreenProps {
  projectId: string;
  mode?: 'create' | 'add';
  listId?: string;
}

export const CreateListScreen: React.FC<CreateListScreenProps> = ({ projectId, mode = 'create', listId }) => {
  const { 
    listName, 
    listImageTemplate, 
    isCreating, 
    error, 
    selectedImages, 
    selectedImagesByAngle, 
    autoCrop, 
    setAutoCrop, 
    isSelectingImages,
    processingProgress,
    currentProcessingImage,
    totalProcessingImages,
    reset 
  } = useStore();

  React.useEffect(() => {
    if (mode === 'add' && listId) {
      // Load existing list details
      createListActions.loadExistingList(listId);
    }

    if (mode === 'create') {
      reset();
    }
  }, [mode, listId]);

  // Handle press for gallery
  const handleAddImages = (angle?: string) => {
    if (mode === 'create' && !listName.trim()) {
      createListActions.setError('Veuillez entrer un nom pour la liste');
      return;
    }
    handleSelectGallery(angle);
  };

  // Handle long press for camera
  const handleAddImagesLongPress = (angle?: string) => {
    if (mode === 'create' && !listName.trim()) {
      createListActions.setError('Veuillez entrer un nom pour la liste');
      return;
    }
    handleSelectCamera(angle);
  };

  // image picker handle by picture temple angles
  const handleAddImagesByAngle = (angle: string) => {
    handleAddImages(angle);
  };

  const handleSelectCamera = async (angle?: string) => {
    console.log('handleSelectCamera called with angle:', angle);
    try {
      await createListActions.selectImages({ angle, source: 'camera' });
    } catch (error) {
      console.error('Error in handleSelectCamera:', error);
    }
  };

  const handleSelectGallery = async (angle?: string) => {
    console.log('handleSelectGallery called with angle:', angle);
    try {
      await createListActions.selectImages({ angle, source: 'gallery' });
    } catch (error) {
      console.error('Error in handleSelectGallery:', error);
    }
  };

  const handleAction = () => {
    if (mode === 'add' && listId) {
      if (listImageTemplate) {
        createListActions.addImagesToListByAngle(listId, projectId);
      } else {
        createListActions.addImagesToList(listId, projectId);
      }
    } else {

      if (listImageTemplate) {
        createListActions.createListWithPictureTempleAngles(projectId);
      } else {
        createListActions.createList(projectId);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage
        title={mode === 'add' ? 'Ajouter des images' : 'Créer une liste'}
        subtitle={mode === 'add' ? 'Ajoutez des images à votre liste' : 'Créez une nouvelle liste d\'images'}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {mode === 'create' && (
            <View>
              <ListNameInput
                listName={listName}
                error={error}
                isCreating={isCreating}
                onChangeText={createListActions.setListName}
              />

              <ListImageTemplateSelect
                listImageTemplate={listImageTemplate}
                error={error}
                isCreating={isCreating}
                onChangeText={createListActions.setListImageTemplate}
                hasImages={
                  selectedImages.length > 0 || 
                  Object.values(selectedImagesByAngle).flat().length > 0
                }
              />
            </View>
          )}

          {mode === 'add' && <AddModeInfo listName={listName} listImageTemplate={listImageTemplate} />}

          <AutoCropToggle
            value={autoCrop}
            onChange={setAutoCrop}
          />
          {listImageTemplate ?
            <PictureTempleAngles
              onAddImagesByAngle={handleAddImagesByAngle}
              onAddImagesByAngleLongPress={(angle) => handleAddImagesLongPress(angle)}
              onRemoveImageByAngle={createListActions.removeImageByAngle} /> :
            selectedImages.length > 0 ? (
              <ImageGrid
                selectedImages={selectedImages}
                isCreating={isCreating}
                isSelectingImages={isSelectingImages}
                onRemoveImage={createListActions.removeImage}
                onAddImages={() => handleAddImages()}
                onLongPress={() => handleAddImagesLongPress()}
              />
            ) : (
              <EmptyImageCard
                isCreating={isCreating}
                isSelectingImages={isSelectingImages}
                onPress={() => handleAddImages()}
                onLongPress={() => handleAddImagesLongPress()}
                hasTemplate={false}
              />
            )}

        </ScrollView>

        <BottomActionButton
          mode={mode}
          isCreating={isCreating}
          hasImages={
            listImageTemplate 
              ? Object.values(selectedImagesByAngle).flat().length > 0
              : selectedImages.length > 0
          }
          onPress={handleAction}
        />
      </KeyboardAvoidingView>
      
      <ProcessingOverlay
        visible={isSelectingImages && totalProcessingImages > 0}
        progress={processingProgress}
        currentImage={currentProcessingImage}
        totalImages={totalProcessingImages}
        message={totalProcessingImages > 1 ? "Traitement des images..." : "Traitement de l'image..."}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 120, // Space for fixed bottom button
  },
});
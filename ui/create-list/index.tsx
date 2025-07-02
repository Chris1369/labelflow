import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
} from './components';

interface CreateListScreenProps {
  projectId: string;
  mode?: 'create' | 'add';
  listId?: string;
}

export const CreateListScreen: React.FC<CreateListScreenProps> = ({ projectId, mode = 'create', listId }) => {
  const { listName, isCreating, error, selectedImages, autoCrop, setAutoCrop, isSelectingImages } = useStore();
  
  React.useEffect(() => {
    if (mode === 'add' && listId) {
      // Load existing list details
      createListActions.loadExistingList(listId);
    }
  }, [mode, listId]);

  const handleAddImages = () => {
    if (mode === 'create' && !listName.trim()) {
      createListActions.setError('Veuillez entrer un nom pour la liste');
      return;
    }
    createListActions.selectImages(projectId);
  };

  const handleAction = () => {
    if (mode === 'add' && listId) {
      createListActions.addImagesToList(listId, projectId);
    } else {
      createListActions.createList(projectId);
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
            <ListNameInput
              listName={listName}
              error={error}
              isCreating={isCreating}
              onChangeText={createListActions.setListName}
            />
          )}
          
          {mode === 'add' && <AddModeInfo listName={listName} />}

          <AutoCropToggle
            value={autoCrop}
            onChange={setAutoCrop}
          />

          {selectedImages.length > 0 ? (
            <ImageGrid
              selectedImages={selectedImages}
              isCreating={isCreating}
              isSelectingImages={isSelectingImages}
              onRemoveImage={createListActions.removeImage}
              onAddImages={handleAddImages}
            />
          ) : (
            <EmptyImageCard 
              isCreating={isCreating} 
              isSelectingImages={isSelectingImages}
              onPress={handleAddImages} 
            />
          )}
        </ScrollView>

        <BottomActionButton
          mode={mode}
          isCreating={isCreating}
          hasImages={selectedImages.length > 0}
          onPress={handleAction}
        />
      </KeyboardAvoidingView>
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
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { useStore } from './useStore';
import { createListActions } from './actions';
import { router } from 'expo-router';

interface CreateListScreenProps {
  projectId: string;
  mode?: 'create' | 'add';
  listId?: string;
}

export const CreateListScreen: React.FC<CreateListScreenProps> = ({ projectId, mode = 'create', listId }) => {
  const { listName, isCreating, error, selectedImages } = useStore();
  
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{mode === 'add' ? 'Ajouter des images' : 'Créer une liste'}</Text>
        <View style={styles.placeholder} />
      </View>

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
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom de la liste</Text>
              <Input
                placeholder="Ex: Photos du salon"
                value={listName}
                onChangeText={createListActions.setListName}
                editable={!isCreating}
              />
              <Text style={styles.hint}>
                Ce nom vous aidera à identifier votre liste d'images
              </Text>
              {error && (
                <Text style={styles.error}>{error}</Text>
              )}
            </View>
          )}
          
          {mode === 'add' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Liste : {listName}</Text>
              <Text style={styles.hint}>
                Sélectionnez des images à ajouter à cette liste
              </Text>
            </View>
          )}

          {selectedImages.length > 0 && (
            <View style={styles.imagesSection}>
              <Text style={styles.sectionTitle}>
                Images sélectionnées ({selectedImages.length})
              </Text>
              
              <View style={styles.imageGrid}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.imageCard}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => createListActions.removeImage(index)}
                      disabled={isCreating}
                    >
                      <Ionicons name="close" size={20} color={theme.colors.secondary} />
                    </TouchableOpacity>
                  </View>
                ))}
                
                <TouchableOpacity 
                  style={styles.addImageCard}
                  onPress={handleAddImages}
                  disabled={isCreating}
                >
                  <Ionicons name="add" size={32} color={theme.colors.primary} />
                  <Text style={styles.addImageText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {selectedImages.length === 0 && (
            <TouchableOpacity 
              style={styles.firstImageCard}
              onPress={handleAddImages}
              disabled={isCreating}
            >
              <Ionicons name="image-outline" size={48} color={theme.colors.primary} />
              <Text style={styles.firstImageTitle}>Ajouter des images</Text>
              <Text style={styles.firstImageHint}>
                Appuyez pour sélectionner vos premières images
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {selectedImages.length > 0 && (
          <View style={styles.bottomContainer}>
            <Button
              title={isCreating ? 
                (mode === 'add' ? "Ajout..." : "Création...") : 
                (mode === 'add' ? "Ajouter les images" : "Créer la liste")
              }
              onPress={() => {
                if (mode === 'add' && listId) {
                  createListActions.addImagesToList(listId, projectId);
                } else {
                  createListActions.createList(projectId);
                }
              }}
              disabled={isCreating || selectedImages.length === 0}
              style={styles.createButton}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    ...theme.fonts.subtitle,
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 120, // Espace pour le bouton fixe en bas
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.fonts.body,
    marginBottom: theme.spacing.sm,
  },
  hint: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  error: {
    ...theme.fonts.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  imagesSection: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.fonts.body,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageCard: {
    width: 106, // Dimensions fixes
    height: 106, // Dimensions fixes
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageCard: {
    width: 106, // Dimensions fixes
    height: 106, // Dimensions fixes
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
  },
  addImageText: {
    ...theme.fonts.caption,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  firstImageCard: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
  },
  firstImageTitle: {
    ...theme.fonts.subtitle,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  firstImageHint: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  createButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
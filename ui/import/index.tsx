import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../types/theme';
import { useImportStore } from './useStore';
import { importActions } from './actions';
import { Button } from '../../components/atoms';

interface ImportScreenProps {
  projectId: string;
}

export const ImportScreen: React.FC<ImportScreenProps> = ({ projectId }) => {
  const {
    selectedImages,
    selectedFile,
    isImporting,
    error,
    importType,
  } = useImportStore();

  useEffect(() => {
    // Reset on mount
    useImportStore.getState().resetImport();
  }, []);

  const hasSelection = selectedImages.length > 0 || selectedFile !== null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!importType && (
          <>
            <Text style={styles.title}>Que souhaitez-vous importer ?</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={importActions.selectImages}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="images"
                    size={48}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.optionTitle}>Images</Text>
                <Text style={styles.optionDescription}>
                  Sélectionnez plusieurs images depuis votre galerie
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionCard}
                onPress={importActions.selectFile}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="document-text"
                    size={48}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.optionTitle}>Fichiers</Text>
                <Text style={styles.optionDescription}>
                  Importez un fichier CSV, XML ou XMLS
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {importType === 'images' && selectedImages.length > 0 && (
          <View style={styles.selectionContainer}>
            <View style={styles.selectionHeader}>
              <Text style={styles.selectionTitle}>
                {selectedImages.length} image(s) sélectionnée(s)
              </Text>
              <TouchableOpacity
                onPress={importActions.clearSelection}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Tout effacer</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageList}
            >
              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => importActions.removeImage(uri)}
                  >
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={importActions.selectImages}
              >
                <Ionicons
                  name="add-circle"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.addMoreText}>Ajouter</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {importType === 'file' && selectedFile && (
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>Fichier sélectionné</Text>
            <View style={styles.fileInfo}>
              <Ionicons
                name="document-text"
                size={48}
                color={theme.colors.primary}
              />
              <Text style={styles.fileName}>
                {selectedFile.split('/').pop()}
              </Text>
              <TouchableOpacity
                onPress={importActions.clearSelection}
                style={styles.changeFileButton}
              >
                <Text style={styles.changeFileText}>Changer de fichier</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {hasSelection && (
          <View style={styles.actionButtons}>
            <Button
              title={isImporting ? '' : 'Importer'}
              onPress={importActions.processImport}
              disabled={isImporting}
              style={styles.importButton}
            >
              {isImporting && (
                <ActivityIndicator color={theme.colors.secondary} size="small" />
              )}
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  optionsContainer: {
    gap: theme.spacing.md,
  },
  optionCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  optionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  optionDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  selectionContainer: {
    marginTop: theme.spacing.lg,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  selectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  clearButton: {
    padding: theme.spacing.sm,
  },
  clearButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  imageList: {
    marginBottom: theme.spacing.lg,
  },
  imageContainer: {
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  addMoreButton: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  fileInfo: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  fileName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  changeFileButton: {
    padding: theme.spacing.sm,
  },
  changeFileText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.error}10`,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  actionButtons: {
    marginTop: theme.spacing.xl,
  },
  importButton: {
    marginBottom: theme.spacing.md,
  },
});
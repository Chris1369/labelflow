import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input, Button } from '@/components/atoms';
import { theme } from '@/types/theme';
import { categoryAPI } from '@/api/category.api';
import { useAddLabelsModalStore } from './addLabelsModal.store';
import { AddLabelsModalProps } from './addLabelsModal.types';
import { Label } from '@/types/label';

export const AddLabelsModal: React.FC<AddLabelsModalProps> = ({
  isVisible,
  onClose,
  category,
  onLabelsUpdated,
}) => {
  const {
    filteredLabels,
    selectedLabelIds,
    searchQuery,
    isLoading,
    isSubmitting,
    error,
    loadAllLabels,
    setSearchQuery,
    toggleLabelSelection,
    setInitialSelectedLabels,
    resetSelection,
    getNewlySelectedLabels,
    getLabelsToRemove,
  } = useAddLabelsModalStore();

  useEffect(() => {
    if (isVisible) {
      // Load all labels and set initial selection
      loadAllLabels();
      // Extract label IDs from the category labels (can be strings or Label objects)
      const labelIds = (category.labels || []).map(label => 
        typeof label === 'string' ? label : label.id
      );
      setInitialSelectedLabels(labelIds);
    } else {
      // Reset when modal closes
      resetSelection();
    }
  }, [isVisible, category.labels]);

  const handleSubmit = async () => {
    // Extract label IDs from the category labels
    const existingLabelIds = (category.labels || []).map(label => 
      typeof label === 'string' ? label : label.id
    );
    const newlySelectedLabels = getNewlySelectedLabels(existingLabelIds);
    const labelsToRemove = getLabelsToRemove(existingLabelIds);
    
    if (newlySelectedLabels.length === 0 && labelsToRemove.length === 0) {
      Alert.alert('Info', 'Aucune modification détectée');
      return;
    }

    useAddLabelsModalStore.setState({ isSubmitting: true });
    
    try {
      // Add newly selected labels
      for (const labelId of newlySelectedLabels) {
        await categoryAPI.addLabel(category.id, labelId);
      }
      
      // Remove unselected labels
      for (const labelId of labelsToRemove) {
        await categoryAPI.removeLabel(category.id, labelId);
      }
      
      const message = [];
      if (newlySelectedLabels.length > 0) {
        message.push(`${newlySelectedLabels.length} label(s) ajouté(s)`);
      }
      if (labelsToRemove.length > 0) {
        message.push(`${labelsToRemove.length} label(s) supprimé(s)`);
      }
      
      Alert.alert('Succès', message.join(' et '));
      onLabelsUpdated();
      onClose();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de modifier les labels');
    } finally {
      useAddLabelsModalStore.setState({ isSubmitting: false });
    }
  };

  const renderLabelItem = ({ item }: { item: Label }) => {
    const isSelected = selectedLabelIds.has(item.id);
    // Check if the label is already in the category
    const isExisting = category.labels?.some(label => 
      typeof label === 'string' ? label === item.id : label.id === item.id
    );
    
    return (
      <TouchableOpacity
        style={[
          styles.labelItem,
          isSelected && styles.labelItemSelected,
          isExisting && styles.labelItemExisting,
        ]}
        onPress={() => toggleLabelSelection(item.id)}
        disabled={false}
      >
        <View style={styles.labelInfo}>
          <Text style={[
            styles.labelName,
            isSelected && styles.labelNameSelected,
            isExisting && styles.labelNameExisting,
          ]}>
            {item.name}
          </Text>
          {item.isPublic && (
            <Text style={styles.publicBadge}>Public</Text>
          )}
        </View>
        <View style={[
          styles.checkbox,
          isSelected && styles.checkboxSelected,
          isExisting && styles.checkboxExisting,
        ]}>
          {(isSelected || isExisting) && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.container}>
              <View style={styles.handle} />
              
              <Text style={styles.title}>Gérer les labels de "{category.name}"</Text>
              
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: theme.colors.info + '10', borderColor: theme.colors.info }]} />
                  <Text style={styles.legendText}>Déjà dans la catégorie</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary }]} />
                  <Text style={styles.legendText}>Sélectionné</Text>
                </View>
              </View>
              
              <Input
                placeholder="Rechercher des labels..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                containerStyle={styles.searchInput}
              />

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              <View style={styles.listContainer}>
                {isLoading ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                ) : (
                  <FlatList
                    data={filteredLabels}
                    keyExtractor={(item) => item.id}
                    renderItem={renderLabelItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                      <Text style={styles.emptyText}>
                        {searchQuery ? 'Aucun label trouvé' : 'Aucun label disponible'}
                      </Text>
                    }
                  />
                )}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  <Text style={styles.cancelText}>Annuler</Text>
                </TouchableOpacity>
                
                <Button
                  title={isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                  onPress={handleSubmit}
                  disabled={isSubmitting || isLoading}
                  style={styles.submitButton}
                />
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.lg,
    height: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    marginBottom: theme.spacing.md,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
  },
  legendText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.sm,
  },
  listContainer: {
    flex: 1,
    marginBottom: theme.spacing.lg,
  },
  listContent: {
    paddingVertical: theme.spacing.xs,
  },
  labelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  labelItemSelected: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary,
  },
  labelItemExisting: {
    backgroundColor: theme.colors.info + '10',
    borderColor: theme.colors.info,
  },
  labelInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  labelName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  labelNameSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  labelNameExisting: {
    color: theme.colors.textSecondary,
  },
  publicBadge: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxExisting: {
    backgroundColor: theme.colors.info,
    borderColor: theme.colors.info,
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
  },
});
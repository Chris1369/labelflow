import React, { useCallback, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { Input } from '../atoms';
import { theme } from '../../types/theme';
import { mockObjectLabels, getObjectCategories, ObjectLabel } from '../../mock/objects';
import { Ionicons } from '@expo/vector-icons';
import { labelAPI } from '@/api/label.api';

interface LabelBottomSheetProps {
  onSelectLabel: (label: string) => void;
}

export interface LabelBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const LabelBottomSheet = forwardRef<LabelBottomSheetRef, LabelBottomSheetProps>(
  ({ onSelectLabel }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [userLabels, setUserLabels] = useState<ObjectLabel[]>([]);
    
    const categories = useMemo(() => ['Tous', 'Mes labels', ...getObjectCategories()], []);
    
    const filteredLabels = useMemo(() => {
      // Combine mock labels with user labels
      let filtered = [...mockObjectLabels, ...userLabels];
      
      // Filter by category
      if (selectedCategory && selectedCategory !== 'Tous') {
        filtered = filtered.filter(label => label.category === selectedCategory);
      }
      
      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(label =>
          label.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return filtered;
    }, [searchQuery, selectedCategory, userLabels]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsVisible(true);
        loadUserLabels();
      },
      close: () => setIsVisible(false),
    }));

    const loadUserLabels = async () => {
      try {
        const labels = await labelAPI.getMyLabels();
        const formattedLabels: ObjectLabel[] = labels.map(label => ({
          id: label.id,
          name: label.name,
          category: 'Mes labels',
          icon: 'pricetag' as any,
        }));
        setUserLabels(formattedLabels);
      } catch (error) {
        console.error('Failed to load user labels:', error);
      }
    };

    const handleSelectLabel = (label: ObjectLabel) => {
      onSelectLabel(label.name);
      setIsVisible(false);
      setSearchQuery('');
      setIsPublic(false);
    };

    const handleAddCustomLabel = async () => {
      if (searchQuery.trim()) {
        setIsCreating(true);
        try {
          await labelAPI.create({
            name: searchQuery.trim(),
            isPublic,
          });
          
          // Add to selection and close
          onSelectLabel(searchQuery.trim());
          setIsVisible(false);
          setSearchQuery('');
          setIsPublic(false);
          
          Alert.alert('Succès', `Label "${searchQuery.trim()}" créé avec succès`);
        } catch (error: any) {
          Alert.alert('Erreur', error.message || 'Impossible de créer le label');
        } finally {
          setIsCreating(false);
        }
      }
    };

    const renderLabel = ({ item }: { item: ObjectLabel }) => (
      <TouchableOpacity
        style={styles.labelItem}
        onPress={() => handleSelectLabel(item)}
      >
        <Text style={styles.labelText}>{item.name}</Text>
        <Text style={styles.labelCategory}>{item.category}</Text>
      </TouchableOpacity>
    );

    const renderCategory = ({ item }: { item: string }) => (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          selectedCategory === item && styles.categoryChipActive,
        ]}
        onPress={() => setSelectedCategory(item === 'Tous' ? null : item)}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === item && styles.categoryTextActive,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.container}>
              <View style={styles.handle} />
              
              <Text style={styles.title}>Sélectionner un label</Text>
              
              <View style={styles.searchContainer}>
                <Input
                  placeholder="Rechercher ou ajouter un label..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  icon="search-outline"
                />
                {searchQuery.trim() && !filteredLabels.some(l => l.name.toLowerCase() === searchQuery.toLowerCase()) && (
                  <View style={styles.addLabelContainer}>
                    <View style={styles.switchContainer}>
                      <Text style={styles.switchLabel}>Rendre public</Text>
                      <Switch
                        value={isPublic}
                        onValueChange={setIsPublic}
                        trackColor={{ 
                          false: theme.colors.border, 
                          true: theme.colors.primary + '80' 
                        }}
                        thumbColor={isPublic ? theme.colors.primary : theme.colors.backgroundSecondary}
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.addButton, isCreating && styles.addButtonDisabled]}
                      onPress={handleAddCustomLabel}
                      disabled={isCreating}
                    >
                      <Ionicons name="add-circle" size={24} color={isCreating ? theme.colors.textSecondary : theme.colors.primary} />
                      <Text style={[styles.addButtonText, isCreating && styles.addButtonTextDisabled]}>
                        {isCreating ? 'Création...' : `Ajouter "${searchQuery}"`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <FlatList
                horizontal
                data={categories}
                keyExtractor={(item) => item}
                renderItem={renderCategory}
                style={styles.categoriesList}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
              />

              <FlatList
                data={filteredLabels}
                keyExtractor={(item) => item.id}
                renderItem={renderLabel}
                style={styles.labelsList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Aucun label trouvé
                  </Text>
                }
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  addLabelContainer: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  switchLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  addButtonText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  addButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
  categoriesList: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    height: 45,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 35,
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  categoryTextActive: {
    color: theme.colors.secondary,
  },
  labelsList: {
    paddingHorizontal: theme.spacing.lg,
  },
  labelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  labelText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
  labelCategory: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  },
});
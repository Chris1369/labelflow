import React, { useCallback, useMemo, useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
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
  Dimensions,
  Keyboard,
} from 'react-native';
import { Input } from '../atoms';
import { theme } from '../../types/theme';
import { mockObjectLabels, getObjectCategories, ObjectLabel } from '../../mock/objects';
import { Ionicons } from '@expo/vector-icons';
import { labelAPI } from '@/api/label.api';
import { categoryAPI } from '@/api/category.api';
import { Category } from '@/types/category';
import { Label } from '@/types/label';
import { RecentLabelsManager } from '@/helpers/recentLabels';

const { height: screenHeight } = Dimensions.get('window');

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
    const [userCategories, setUserCategories] = useState<Category[]>([]);
    const [categoryLabels, setCategoryLabels] = useState<{ [categoryId: string]: Label[] }>({});
    const [recentLabels, setRecentLabels] = useState<string[]>([]);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    
    const categories = useMemo(() => {
      const dynamicCategories = userCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        isDynamic: true
      }));
      const staticCategories = ['Tous', 'Mes labels', ...getObjectCategories()].map(name => ({
        id: name,
        name: name,
        isDynamic: false
      }));
      return [...dynamicCategories, ...staticCategories];
    }, [userCategories]);
    
    const filteredLabels = useMemo(() => {
      // Create a map to track if a label is dynamic (user-created)
      const userLabelNames = new Set(userLabels.map(l => l.name.toLowerCase()));
      
      // If a dynamic category is selected, show its labels
      if (selectedCategory && userCategories.some(cat => cat.id === selectedCategory)) {
        const catLabels = categoryLabels[selectedCategory] || [];
        const formatted = catLabels.map(label => ({
          id: label.id,
          name: label.name,
          category: userCategories.find(cat => cat.id === selectedCategory)?.name || '',
          icon: 'pricetag' as any,
          isDynamic: true,
        }));
        
        if (searchQuery) {
          return formatted.filter(label =>
            label.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return formatted;
      }
      
      // Otherwise, use the original logic
      let allLabels = [...mockObjectLabels, ...userLabels];
      
      // Mark dynamic labels
      allLabels = allLabels.map(label => ({
        ...label,
        isDynamic: userLabelNames.has(label.name.toLowerCase())
      }));
      
      // If showing all labels and no search query, show recent labels first
      if (!selectedCategory && !searchQuery && recentLabels.length > 0) {
        const recentLabelObjects: ObjectLabel[] = recentLabels
          .map(labelName => {
            const found = allLabels.find(l => l.name === labelName);
            if (found) return { ...found, isRecent: true };
            return {
              id: `recent-${labelName}`,
              name: labelName,
              category: 'Récents',
              icon: 'time' as any,
              isDynamic: userLabelNames.has(labelName.toLowerCase()),
              isRecent: true,
            };
          })
          .filter(Boolean);
        
        // Remove duplicates from the main list
        const recentNames = new Set(recentLabels);
        const otherLabels = allLabels.filter(label => !recentNames.has(label.name));
        
        return [...recentLabelObjects, ...otherLabels];
      }
      
      // Filter by category
      if (selectedCategory && selectedCategory !== 'Tous') {
        allLabels = allLabels.filter(label => label.category === selectedCategory);
      }
      
      // Filter by search query
      if (searchQuery) {
        allLabels = allLabels.filter(label =>
          label.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return allLabels;
    }, [searchQuery, selectedCategory, userLabels, userCategories, categoryLabels, recentLabels]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsVisible(true);
        loadUserData();
      },
      close: () => {
        setIsVisible(false);
        Keyboard.dismiss();
      },
    }));

    useEffect(() => {
      const keyboardWillShow = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        (e) => {
          setKeyboardHeight(e.endCoordinates.height);
        }
      );
      
      const keyboardWillHide = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => {
          setKeyboardHeight(0);
        }
      );

      return () => {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      };
    }, []);

    const loadUserData = async () => {
      try {
        // Load recent labels
        const recent = await RecentLabelsManager.getRecentLabels();
        setRecentLabels(recent);
        
        // Load user labels
        const labels = await labelAPI.getMyLabels();
        const formattedLabels: ObjectLabel[] = labels.map(label => ({
          id: label.id,
          name: label.name,
          category: 'Mes labels',
          icon: 'pricetag' as any,
        }));
        setUserLabels(formattedLabels);
        
        // Load user categories
        const categories = await categoryAPI.getMyCategories();
        setUserCategories(categories);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    
    // Load category labels when a category is selected
    useEffect(() => {
      if (selectedCategory && userCategories.some(cat => cat.id === selectedCategory)) {
        loadCategoryLabels(selectedCategory);
      }
    }, [selectedCategory, userCategories]);
    
    const loadCategoryLabels = async (categoryId: string) => {
      try {
        const category = userCategories.find(cat => cat.id === categoryId);
        if (category && category.labels) {
          // If labels are populated objects
          if (typeof category.labels[0] === 'object') {
            setCategoryLabels(prev => ({
              ...prev,
              [categoryId]: category.labels as Label[]
            }));
          } else {
            // If labels are IDs, we might need to fetch them
            // For now, we'll assume they're populated
            console.log('Labels are IDs, not objects');
          }
        }
      } catch (error) {
        console.error('Failed to load category labels:', error);
      }
    };

    const handleSelectLabel = async (label: ObjectLabel) => {
      // Add to recent labels
      await RecentLabelsManager.addRecentLabel(label.name);
      
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
          
          // Add to recent labels
          await RecentLabelsManager.addRecentLabel(searchQuery.trim());
          
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

    const renderLabel = ({ item }: { item: ObjectLabel & { isDynamic?: boolean; isRecent?: boolean } }) => (
      <TouchableOpacity
        style={[styles.labelItem, item.isRecent && styles.recentLabelItem]}
        onPress={() => handleSelectLabel(item)}
      >
        <View style={styles.labelContent}>
          <Text style={styles.labelText}>{item.name}</Text>
          {item.isDynamic && (
            <View style={styles.dynamicLabelIndicator} />
          )}
        </View>
        <Text style={[styles.labelCategory, item.isRecent && styles.recentLabelCategory]}>
          {item.category}
        </Text>
      </TouchableOpacity>
    );

    const renderCategory = ({ item }: { item: { id: string; name: string; isDynamic: boolean } }) => (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          selectedCategory === item.id && styles.categoryChipActive,
        ]}
        onPress={() => setSelectedCategory(item.name === 'Tous' ? null : item.id)}
      >
        <View style={styles.categoryContent}>
          <Text
            style={[
              styles.categoryText,
              selectedCategory === item.id && styles.categoryTextActive,
            ]}
          >
            {item.name}
          </Text>
          {item.isDynamic && (
            <View style={styles.dynamicIndicator} />
          )}
        </View>
      </TouchableOpacity>
    );

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={() => setIsVisible(false)}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={[styles.container, { maxHeight: screenHeight * 0.9 - keyboardHeight }]}>
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
                keyExtractor={(item) => item.id}
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
        </View>
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
  overlayTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    minHeight: screenHeight * 0.5,
    maxHeight: screenHeight * 0.9,
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
    ...theme.fonts.title,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
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
    ...theme.fonts.body,
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
    ...theme.fonts.button,
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
  },
  addButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
  categoriesList: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    minHeight: 45,
    maxHeight: 45,
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
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  categoryText: {
    ...theme.fonts.caption,
    color: theme.colors.text,
  },
  categoryTextActive: {
    color: theme.colors.secondary,
  },
  dynamicIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginLeft: 4,
  },
  labelsList: {
    paddingHorizontal: theme.spacing.lg,
    flex: 1,
  },
  labelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  recentLabelItem: {
    backgroundColor: theme.colors.primary + '05',
  },
  labelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  labelText: {
    ...theme.fonts.body,
  },
  labelCategory: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  },
  recentLabelCategory: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  dynamicLabelIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  emptyText: {
    ...theme.fonts.body,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  },
});
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input, HeaderPage } from '@/components/atoms';
import { theme } from '@/types/theme';
import { Label } from '@/types/label';
import { useCategoriesStore } from './useStore';
import { CategoryItem } from './components/CategoryItem';
import { CreateCategoryBottomSheet, CreateCategoryBottomSheetRef } from './components/CreateCategoryBottomSheet';
import { useSettingsStore } from '../settings/useStore';
import { useMyCategories } from '@/hooks/queries';

export const CategoriesScreen: React.FC = () => {
  const bottomSheetRef = useRef<CreateCategoryBottomSheetRef>(null);
  const includePublic = useSettingsStore.getState().includePublicCategories;

  const {
    filteredCategories,
    expandedCategories,
    searchQuery,
    isSearching,
    error,
    setSearchQuery,
    toggleCategory,
    deleteCategory,
    initCategories,
  } = useCategoriesStore();

  const { data: categories, isLoading, refetch } = useMyCategories(includePublic);

  useEffect(() => {
    if (categories) {
      initCategories({ categories, refreshCategories: refetch });
    }
  }, [categories]);

  const handleCreateCategory = () => {
    bottomSheetRef.current?.open();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="folder-open" size={64} color={theme.colors.textSecondary} />
      <Text style={styles.emptyText}>
        {searchQuery ? 'Aucune catégorie trouvée' : 'Aucune catégorie disponible'}
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateCategory}
      >
        <Text style={styles.createButtonText}>Créer une catégorie</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage 
        title="Catégories" 
        subtitle="Gérez vos catégories de labels"
        rightAction={{
          icon: 'add-circle-outline',
          onPress: handleCreateCategory
        }}
      />
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Rechercher une catégorie..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search"
          containerStyle={styles.searchInput}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement des catégories...</Text>
        </View>
      ) : isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <CategoryItem
              category={item}
              labels={
                item.labels
                  ?.filter((label): label is Label => typeof label === 'object')
                || []
              }
              isExpanded={expandedCategories[item.id] || false}
              onToggle={() => toggleCategory(item.id)}
              onDelete={() => deleteCategory(item.id)}
              onLabelsUpdated={() => refetch()}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      <CreateCategoryBottomSheet ref={bottomSheetRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  createButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  createButtonText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  retryText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});
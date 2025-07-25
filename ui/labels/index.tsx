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
import { useLabelsStore } from './useStore';
import { LabelCard } from './components/LabelCard';
import { CreateLabelBottomSheet, CreateLabelBottomSheetRef } from './components/CreateLabelBottomSheet';
import { useMyLabels } from '@/hooks/queries';
import { useSettingsStore } from '../settings/useStore';

export const LabelsScreen: React.FC = () => {
  const bottomSheetRef = useRef<CreateLabelBottomSheetRef>(null);
  const includePublic = useSettingsStore.getState().includePublicLabels;

  const {
    filteredLabels,
    searchQuery,
    isSearching,
    error,
    setSearchQuery,
    deleteLabel,
    initLabels
  } = useLabelsStore();

  // fetch labels
  const { data: labels, isLoading, refetch } = useMyLabels(includePublic);

  useEffect(() => {
    if (labels) {
      initLabels({ labels, refreshLabels: refetch });
    }
  }, [labels]);

  const handleCreateLabel = () => {
    bottomSheetRef.current?.open();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="pricetags" size={64} color={theme.colors.textSecondary} />
      <Text style={styles.emptyText}>
        {searchQuery ? 'Aucun label trouvé' : 'Aucun label disponible'}
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateLabel}
      >
        <Text style={styles.createButtonText}>Créer un label</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage 
        title="Labels" 
        subtitle="Gérez vos labels personnalisés"
        rightAction={{
          icon: 'add-circle-outline',
          onPress: handleCreateLabel
        }}
      />
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Rechercher un label..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search"
          containerStyle={styles.searchInput}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement des labels...</Text>
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
          data={filteredLabels}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <LabelCard
              label={item}
              onDelete={() => deleteLabel(item.id)}
              onUpdate={() => refetch()}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      <CreateLabelBottomSheet ref={bottomSheetRef} />
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
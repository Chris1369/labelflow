import React, { useEffect } from 'react';
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
import { Input } from '@/components/atoms';
import { theme } from '@/types/theme';
import { useStore } from './useStore';
import { actions } from './actions';
import { router } from 'expo-router';

interface SelectUnlabeledListScreenProps {
  projectId: string;
}

interface UnlabeledListItem {
  id?: string;
  _id?: string;
  name: string;
  items?: any[];
  createdAt?: string;
}

export const SelectUnlabeledListScreen: React.FC<SelectUnlabeledListScreenProps> = ({ projectId }) => {
  const { 
    lists, 
    filteredLists, 
    searchQuery, 
    isLoading, 
    error 
  } = useStore();

  useEffect(() => {
    actions.loadLists(projectId);
  }, [projectId]);

  const handleListSelect = (list: UnlabeledListItem) => {
    const listId = list.id || list._id;
    if (listId) {
      router.push(`/(project)/${projectId}/label-list?listId=${listId}`);
    }
  };

  const renderListItem = ({ item }: { item: UnlabeledListItem }) => {
    const itemCount = item.items?.length || 0;
    const listId = item.id || item._id;
    
    return (
      <TouchableOpacity
        style={styles.listCard}
        onPress={() => handleListSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.listHeader}>
          <View style={styles.listInfo}>
            <Text style={styles.listName}>{item.name}</Text>
            <View style={styles.metaInfo}>
              <View style={styles.countBadge}>
                <Ionicons name="images-outline" size={14} color={theme.colors.primary} />
                <Text style={styles.countText}>{itemCount} image{itemCount !== 1 ? 's' : ''}</Text>
              </View>
              {item.createdAt && (
                <Text style={styles.dateText}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.colors.textSecondary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="folder-open" 
        size={64} 
        color={theme.colors.textSecondary} 
      />
      <Text style={styles.emptyText}>
        {searchQuery ? "Aucune liste trouvée" : "Aucune liste disponible"}
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push(`/(project)/${projectId}/create-list`)}
      >
        <Text style={styles.createButtonText}>Créer une liste</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Listes à labeliser</Text>
        <Input
          placeholder="Rechercher une liste..."
          value={searchQuery}
          onChangeText={actions.setSearchQuery}
          icon="search"
          containerStyle={styles.searchInput}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            Chargement des listes...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => actions.loadLists(projectId)}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredLists}
            keyExtractor={(item) => item.id || item._id || ''}
            renderItem={renderListItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => router.push(`/(project)/${projectId}/create-list`)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={32} color={theme.colors.secondary} />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    ...theme.fonts.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  listCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  listInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  listName: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  countText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
  },
  dateText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.fonts.subtitle,
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
    ...theme.fonts.button,
    color: theme.colors.secondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  errorText: {
    ...theme.fonts.body,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
  },
  retryText: {
    ...theme.fonts.button,
    color: theme.colors.secondary,
  },
  floatingButton: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
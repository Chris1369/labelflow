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
      <Ionicons name="folder-open-outline" size={64} color={theme.colors.textSecondary} />
      <Text style={styles.emptyTitle}>Aucune liste à labeliser</Text>
      <Text style={styles.emptyText}>
        Appuyez sur + pour créer votre première liste
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={styles.title}>Listes à labeliser</Text>
      <View style={styles.placeholder} />
    </View>
  );

  if (isLoading && lists.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement des listes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Rechercher une liste..."
          value={searchQuery}
          onChangeText={actions.setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={theme.colors.textSecondary} />}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredLists}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id || item._id || ''}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshing={isLoading}
        onRefresh={() => actions.loadLists(projectId)}
      />

      {/* Floating button to create new list */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push(`/(project)/${projectId}/create-list`)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={theme.colors.secondary} />
      </TouchableOpacity>
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
  searchContainer: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.error}10`,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    ...theme.fonts.caption,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100, // Pour le bouton flottant
  },
  listCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  listName: {
    ...theme.fonts.subtitle,
    marginBottom: theme.spacing.xs,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  countText: {
    ...theme.fonts.caption,
    color: theme.colors.primary,
  },
  dateText: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    ...theme.fonts.subtitle,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
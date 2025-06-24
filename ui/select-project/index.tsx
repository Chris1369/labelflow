import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Input } from '../../components/atoms';
import { theme } from '../../types/theme';
import { useSelectProjectStore } from './useStore';
import { selectProjectActions } from './actions';
import { Project } from '../../types/project';

export const SelectProjectScreen: React.FC = () => {
  const { filteredProjects, searchQuery } = useSelectProjectStore();

  useEffect(() => {
    selectProjectActions.loadProjects();
  }, []);

  const renderProjectItem = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => selectProjectActions.handleProjectSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.projectDescription}>{item.description}</Text>
        )}
        <View style={styles.projectMeta}>
          <Text style={styles.itemCount}>{item.itemCount} items</Text>
          <Text style={styles.updatedDate}>
            Modifié le {item.updatedAt.toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Rechercher un projet..."
          value={searchQuery}
          onChangeText={selectProjectActions.handleSearchChange}
          icon="search-outline"
        />
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={renderProjectItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun projet trouvé</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  projectCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  projectDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  updatedDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
});
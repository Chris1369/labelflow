import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SimpleBottomSheet } from '@/components/molecules/SimpleBottomSheet';
import { Input, Button } from '@/components/atoms';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { teamKeys, useMyProjects, useTeamProjects } from '@/hooks/queries';
import { Project } from '@/types/project';
import { teamAPI } from '@/api/team.api';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { invalidateQuery } from '@/helpers/invalidateQuery';

export interface TeamProjectsBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface TeamProjectsBottomSheetProps {
  teamId: string;
}

export const TeamProjectsBottomSheet = forwardRef<
  TeamProjectsBottomSheetRef,
  TeamProjectsBottomSheetProps
>(({ teamId }, ref) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { handleError, wrapAsync } = useErrorHandler('TeamProjectsBottomSheet');

  const { projects: userProjects = [], isLoading: loadingUserProjects } = useMyProjects();
  const { data: teamProjects = [], refetch: refetchTeamProjects, isLoading: loadingTeamProjects } = useTeamProjects(teamId);

  useEffect(() => {
    if (teamProjects.length > 0) {
      setSelectedProjects(teamProjects.map(p => p.id));
    }
  }, [teamProjects]);

  useEffect(() => {
    if (visible) {
      refetchTeamProjects();
    }
  }, [visible]);

  const filteredProjects = userProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  const handleToggleProject = (projectId: string) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const handleSave = wrapAsync(async () => {
    setIsUpdating(true);
    try {
      // Get current team project IDs
      const currentProjectIds = teamProjects.map(p => p.id);

      // Find projects to add and remove
      const projectsToAdd = selectedProjects.filter(id => !currentProjectIds.includes(id));
      const projectsToRemove = currentProjectIds.filter(id => !selectedProjects.includes(id));

      // Update projects using the batch update method
      if (projectsToAdd.length > 0) {
        await teamAPI.updateProjects(teamId, 'add', projectsToAdd);
      }

      if (projectsToRemove.length > 0) {
        await teamAPI.updateProjects(teamId, 'remove', projectsToRemove);
      }
      invalidateQuery(teamKeys.list({ my: true }));
      setVisible(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsUpdating(false);
    }
  });

  const renderProjectItem = ({ item }: { item: Project }) => {
    const isSelected = selectedProjects.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.projectItem}
        onPress={() => handleToggleProject(item.id)}
      >
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.projectDescription} numberOfLines={1}>
              {item.description}
            </Text>
          )}
          <Text style={styles.projectDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={18} color={theme.colors.secondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const isLoading = loadingUserProjects || loadingTeamProjects;

  return (
    <SimpleBottomSheet
      visible={visible}
      onClose={() => setVisible(false)}
      height="90%"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Projets de l'équipe</Text>
          <Text style={styles.subtitle}>
            {selectedProjects.length} projet{selectedProjects.length > 1 ? 's' : ''} sélectionné{selectedProjects.length > 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Input
            placeholder="Rechercher un projet..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search"
            containerStyle={styles.searchInput}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Chargement des projets...</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={filteredProjects}
              keyExtractor={(item) => item.id}
              renderItem={renderProjectItem}
              contentContainerStyle={styles.projectsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'Aucun projet trouvé' : 'Aucun projet disponible'}
                  </Text>
                </View>
              }
            />

            <View style={styles.footer}>
              <View style={styles.separator} />
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setVisible(false)}
                  disabled={isUpdating}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <Button
                  title="Enregistrer"
                  onPress={handleSave}
                  loading={isUpdating}
                  disabled={isUpdating}
                  style={styles.saveButton}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </SimpleBottomSheet>
  );
});

TeamProjectsBottomSheet.displayName = 'TeamProjectsBottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  projectsList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  projectInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  projectName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  projectDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
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
  emptyContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  footer: {
    backgroundColor: theme.colors.background,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...theme.fonts.button,
    color: theme.colors.textSecondary,
  },
  saveButton: {
    flex: 1,
  },
});
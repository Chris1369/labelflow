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
import { Input, Button } from '../../components/atoms';
import { theme } from '../../types/theme';
import { useTeamProjectsStore } from './useStore';
import { teamProjectsActions } from './actions';
import { Project } from '../../mock/projects';

interface TeamProjectsScreenProps {
  teamId: string;
}

export const TeamProjectsScreen: React.FC<TeamProjectsScreenProps> = ({ teamId }) => {
  const {
    filteredProjects,
    selectedProjects,
    searchQuery,
    isUpdating,
  } = useTeamProjectsStore();

  useEffect(() => {
    teamProjectsActions.loadProjects();
  }, []);

  const renderProject = ({ item }: { item: Project }) => {
    const isSelected = selectedProjects.has(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.projectCard, isSelected && styles.selectedCard]}
        onPress={() => teamProjectsActions.toggleProject(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.projectHeader}>
          <View style={styles.projectInfo}>
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.projectDescription} numberOfLines={1}>
              {item.description}
            </Text>
          </View>
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && (
              <Ionicons name="checkmark" size={20} color={theme.colors.secondary} />
            )}
          </View>
        </View>
        <View style={styles.projectStats}>
          <Text style={styles.statText}>
            {item.itemCount} items • Créé le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedProjects.size} projet{selectedProjects.size > 1 ? 's' : ''} sélectionné{selectedProjects.size > 1 ? 's' : ''}
        </Text>
        <Input
          placeholder="Rechercher un projet..."
          value={searchQuery}
          onChangeText={teamProjectsActions.searchProjects}
          icon="search"
          containerStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={renderProject}
        contentContainerStyle={styles.projectsList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.bottomActions}>
        <Button
          title={isUpdating ? '' : 'Enregistrer les modifications'}
          onPress={teamProjectsActions.saveChanges}
          disabled={isUpdating}
          style={styles.saveButton}
        >
          {isUpdating && (
            <ActivityIndicator color={theme.colors.secondary} size="small" />
          )}
        </Button>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={teamProjectsActions.cancel}
          disabled={isUpdating}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  projectsList: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  projectCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  projectInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  projectName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  projectDescription: {
    fontSize: theme.fontSize.sm,
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
  projectStats: {
    marginTop: theme.spacing.sm,
  },
  statText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: theme.spacing.md,
  },
  bottomActions: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  saveButton: {
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});
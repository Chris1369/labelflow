import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';
import { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { EmptyProjectsState } from './EmptyProjectsState';

interface ProjectsListProps {
  projects: Project[];
  selectedProjects: Set<string>;
  searchQuery: string;
  onToggleProject: (projectId: string) => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  selectedProjects,
  searchQuery,
  onToggleProject,
}) => {
  const renderProject = ({ item }: { item: Project }) => {
    const itemId = item._id || item.id;
    const isSelected = selectedProjects.has(itemId);

    return (
      <ProjectCard
        project={item}
        isSelected={isSelected}
        onPress={() => onToggleProject(itemId)}
      />
    );
  };

  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item._id || item.id}
      renderItem={renderProject}
      contentContainerStyle={styles.projectsList}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={() => (
        <EmptyProjectsState searchQuery={searchQuery} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  projectsList: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  separator: {
    height: theme.spacing.md,
  },
});
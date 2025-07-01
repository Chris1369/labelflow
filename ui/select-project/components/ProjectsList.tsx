import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { theme } from "@/types/theme";
import { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "./EmptyState";

interface ProjectsListProps {
  projects: Project[];
  searchQuery: string;
  onProjectSelect: (project: Project) => void;
  onCreateProject: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  searchQuery,
  onProjectSelect,
  onCreateProject,
}) => {
  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProjectCard project={item} onPress={onProjectSelect} />
      )}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <EmptyState searchQuery={searchQuery} onCreateProject={onCreateProject} />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  separator: {
    height: theme.spacing.md,
  },
});
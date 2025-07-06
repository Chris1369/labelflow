import React from "react";
import { View, StyleSheet } from "react-native";
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
  if (projects.length === 0) {
    return <EmptyState searchQuery={searchQuery} onCreateProject={onCreateProject} />;
  }

  return (
    <View style={styles.listContent}>
      {projects.map((project, index) => (
        <View key={project.id}>
          <ProjectCard project={project} onPress={onProjectSelect} />
          {index < projects.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  separator: {
    height: theme.spacing.md,
  },
});
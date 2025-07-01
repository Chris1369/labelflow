import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onPress: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.projectCard, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.projectHeader}>
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.projectDescription} numberOfLines={1}>
            {project.description}
          </Text>
        </View>
        <View
          style={[styles.checkbox, isSelected && styles.checkboxSelected]}
        >
          {isSelected && (
            <Ionicons
              name='checkmark'
              size={20}
              color={theme.colors.secondary}
            />
          )}
        </View>
      </View>
      <View style={styles.projectStats}>
        <Text style={styles.statText}>
          {project.items?.length || 0} items • Créé le{" "}
          {new Date(project.createdAt).toLocaleDateString("fr-FR")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  projectInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  projectName: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
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
    alignItems: "center",
    justifyContent: "center",
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
});
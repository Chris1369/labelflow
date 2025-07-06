import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onPress: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => onPress(project)}
      activeOpacity={0.7}
    >
      <View style={styles.projectHeader}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="folder-outline"
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{project.name}</Text>
          {project.isPublic && (
            <View style={styles.publicBadge}>
              <Text style={styles.publicText}>Public</Text>
            </View>
          )}
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>
      {project.description ? (
        <Text style={styles.projectDescription as TextStyle} numberOfLines={2}>
          {project.description}
        </Text>
      ) : (
        <Text style={[styles.projectDescription as TextStyle, { fontStyle: 'italic' }]}>
          Aucune description
        </Text>
      )}
      <View style={styles.projectStats}>
        <View style={styles.stat}>
          <Ionicons
            name="images"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>{project.items?.length || 0} items</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons
            name="calendar"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>
            {new Date(project.updatedAt).toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  projectCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  projectInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  projectName: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
  } as TextStyle,
  publicBadge: {
    backgroundColor: theme.colors.info + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  publicText: {
    ...theme.fonts.label,
    color: theme.colors.info,
  } as TextStyle,
  projectDescription: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  projectStats: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
  } as TextStyle,
});
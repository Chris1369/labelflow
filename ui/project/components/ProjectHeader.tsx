import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { Project } from "@/types/project";

interface ProjectHeaderProps {
  project: Project | null | undefined;
  onEyePress: () => void;
  onSwitchChange: (value: boolean) => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onEyePress,
  onSwitchChange,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{project?.name || "Projet"}</Text>
        {project?.labelCounter && project.labelCounter.length > 0 && (
          <TouchableOpacity style={styles.eyeButton} onPress={onEyePress}>
            <Ionicons name='eye' size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      {project?.description && (
        <Text style={styles.subtitle}>{project.description}</Text>
      )}

      <View style={styles.switchContainer}>
        <View style={styles.switchLabel}>
          <Text style={styles.switchLabelText}>Projet public</Text>
          <Text style={styles.switchDescription}>
            Visible par tous les utilisateurs
          </Text>
        </View>
        <Switch
          value={project?.isPublic || false}
          onValueChange={onSwitchChange}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary + "80",
          }}
          thumbColor={
            project?.isPublic
              ? theme.colors.primary
              : theme.colors.backgroundSecondary
          }
        />
      </View>

      <Text style={styles.itemCount}>{project?.items?.length || 0} items</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.fonts.title,
    color: theme.colors.text,
  } as TextStyle,
  eyeButton: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  itemCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.lg,
    width: "100%",
    maxWidth: 350,
  },
  switchLabel: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  switchLabelText: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text,
  },
  switchDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

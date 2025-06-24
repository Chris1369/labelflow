import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { projectActions } from "./actions";
import { useProjectStore } from "./useStore";
import { router } from "expo-router";

interface ProjectMenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  variant?: "default" | "warning" | "danger";
}

interface ProjectScreenProps {
  projectId: string;
}

export const ProjectScreen: React.FC<ProjectScreenProps> = ({ projectId }) => {
  const { currentProject, isModalVisible, modalType, isLoading, error } =
    useProjectStore();

  useEffect(() => {
    useProjectStore.getState().loadProject(projectId);
  }, [projectId]);

  useEffect(() => {
    if (isModalVisible && modalType) {
      projectActions.showWarningModal();
    }
  }, [isModalVisible, modalType]);

  const menuItems: ProjectMenuItem[] = [
    {
      id: "add-items",
      title: "Ajouter des items",
      icon: "camera",
      onPress: () => projectActions.handleAddItems(projectId),
      color: theme.colors.primary,
    },
    {
      id: "view-items",
      title: "Voir les items",
      icon: "images",
      onPress: () => projectActions.handleViewItems(projectId),
    },
    {
      id: "export",
      title: "Exporter",
      icon: "download",
      onPress: () => projectActions.handleExport(projectId),
    },
    {
      id: "import",
      title: "Importer",
      icon: "cloud-upload",
      onPress: () => projectActions.handleImport(projectId),
    },
    {
      id: "reset",
      title: "Réinitialiser",
      icon: "refresh",
      onPress: projectActions.handleReset,
      color: theme.colors.warning,
      variant: "warning",
    },
    {
      id: "delete",
      title: "Supprimer",
      icon: "trash",
      onPress: projectActions.handleDelete,
      color: theme.colors.error,
      variant: "danger",
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement du projet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => useProjectStore.getState().loadProject(projectId)}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(main)/select-project")}
          >
            <Text style={styles.backText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentProject?.name || "Projet"}</Text>
          {currentProject?.description && (
            <Text style={styles.subtitle}>{currentProject.description}</Text>
          )}
          <Text style={styles.itemCount}>
            {currentProject?.items?.length || 0} items
          </Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  item.color && { backgroundColor: item.color + "20" },
                  item.variant === "warning" && styles.warningContainer,
                  item.variant === "danger" && styles.dangerContainer,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={48}
                  color={item.color || theme.colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.menuItemText,
                  item.variant === "warning" && styles.warningText,
                  item.variant === "danger" && styles.dangerText,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.exitButtonText}>Quitter le projet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
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
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
  },
  menuItem: {
    width: "47%",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  warningContainer: {
    borderColor: theme.colors.warning,
  },
  dangerContainer: {
    borderColor: theme.colors.error,
  },
  menuItemText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: "500",
    textAlign: "center",
  },
  warningText: {
    color: theme.colors.warning,
  },
  dangerText: {
    color: theme.colors.error,
  },
  bottomSection: {
    marginTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  exitButton: {
    alignItems: "center",
    padding: theme.spacing.md,
  },
  exitButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  retryText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  backButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },
});

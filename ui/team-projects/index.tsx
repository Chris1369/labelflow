import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Input, Button } from "@/components/atoms";
import { theme } from "@/types/theme";
import { useTeamProjectsStore } from "./useStore";
import { teamProjectsActions } from "./actions";
import { Project } from "@/types/project";

interface TeamProjectsScreenProps {
  teamId: string;
}

export const TeamProjectsScreen: React.FC<TeamProjectsScreenProps> = ({
  teamId,
}) => {
  const {
    allProjects,
    filteredProjects,
    selectedProjects,
    searchQuery,
    isLoading,
    isUpdating,
    isSearching,
    error,
  } = useTeamProjectsStore();

  useEffect(() => {
    teamProjectsActions.loadTeamProjects(teamId);
  }, [teamId]);

  const renderProject = ({ item }: { item: Project }) => {
    const itemId = item._id || item.id;
    const isSelected = selectedProjects.has(itemId);

    return (
      <TouchableOpacity
        style={[styles.projectCard, isSelected && styles.selectedCard]}
        onPress={() => teamProjectsActions.toggleProject(itemId)}
        activeOpacity={0.7}
      >
        <View style={styles.projectHeader}>
          <View style={styles.projectInfo}>
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.projectDescription} numberOfLines={1}>
              {item.description}
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
            {item.items?.length || 0} items • Créé le{" "}
            {new Date(item.createdAt).toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedProjects.size} projet{selectedProjects.size > 1 ? "s" : ""}{" "}
          sélectionné{selectedProjects.size > 1 ? "s" : ""} sur{" "}
          {allProjects.length}
        </Text>
        <Input
          placeholder='Rechercher un projet...'
          value={searchQuery}
          onChangeText={teamProjectsActions.searchProjects}
          icon='search'
          containerStyle={styles.searchInput}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement des projets...</Text>
        </View>
      ) : isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => teamProjectsActions.loadTeamProjects(teamId)}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderProject}
          contentContainerStyle={styles.projectsList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons
                name='folder-open'
                size={64}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Aucun projet trouvé"
                  : "Aucun projet disponible"}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.bottomActions}>
        <Button
          title={isUpdating ? "" : "Enregistrer les modifications"}
          onPress={() => teamProjectsActions.saveChanges(teamId)}
          disabled={isUpdating}
          style={styles.saveButton}
        >
          {isUpdating && (
            <ActivityIndicator color={theme.colors.secondary} size='small' />
          )}
        </Button>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => teamProjectsActions.cancel(teamId)}
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
    fontWeight: "600",
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
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
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
  },
  retryText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});

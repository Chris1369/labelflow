import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@/components/atoms";
import { theme } from "@/types/theme";
import { useSelectProjectStore } from "./useStore";
import { selectProjectActions } from "./actions";
import { Project } from "@/types/project";

export const SelectProjectScreen: React.FC = () => {
  const { filteredProjects, searchQuery, isLoading, isSearching, error } =
    useSelectProjectStore();

  useEffect(() => {
    selectProjectActions.loadProjects();
  }, []);

  const renderProjectItem = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => selectProjectActions.handleProjectSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.projectHeader}>
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          {item.isPublic && (
            <View style={styles.publicBadge}>
              <Text style={styles.publicText}>Public</Text>
            </View>
          )}
        </View>
        <Ionicons
          name='chevron-forward'
          size={24}
          color={theme.colors.textSecondary}
        />
      </View>
      <Text style={styles.projectDescription as TextStyle} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.projectStats}>
        <View style={styles.stat}>
          <Ionicons
            name='images'
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>{item.items?.length || 0} items</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons
            name='calendar'
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>
            {new Date(item.updatedAt).toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name='folder-open'
        size={64}
        color={theme.colors.textSecondary}
      />
      <Text style={styles.emptyText as TextStyle}>
        {searchQuery ? "Aucun projet trouvé" : "Aucun projet disponible"}
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => selectProjectActions.createNewProject()}
      >
        <Text style={styles.createButtonText}>Créer un projet</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title as TextStyle}>Sélectionner un projet</Text>
        <Input
          placeholder='Rechercher un projet...'
          value={searchQuery}
          onChangeText={selectProjectActions.handleSearchChange}
          icon='search'
          containerStyle={styles.searchInput}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
          <Text style={styles.loadingText as TextStyle}>
            Chargement des projets...
          </Text>
        </View>
      ) : isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
          <Text style={styles.loadingText as TextStyle}>
            Recherche en cours...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText as TextStyle}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => selectProjectActions.loadProjects()}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredProjects}
            keyExtractor={(item) => item.id}
            renderItem={renderProjectItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => selectProjectActions.createNewProject()}
            activeOpacity={0.8}
          >
            <Ionicons name='add' size={32} color={theme.colors.secondary} />
          </TouchableOpacity>
        </>
      )}
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
  },
  title: {
    ...theme.fonts.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  projectCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
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
  separator: {
    height: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.fonts.subtitle,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  createButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  createButtonText: {
    ...theme.fonts.button,
    color: theme.colors.secondary,
  } as TextStyle,
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...theme.fonts.body,
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  errorText: {
    ...theme.fonts.body,
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
    ...theme.fonts.button,
    color: theme.colors.secondary,
  } as TextStyle,
  floatingButton: {
    position: "absolute",
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

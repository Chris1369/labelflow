import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderPage, Input } from "@/components/atoms";
import { theme } from "@/types/theme";
import { useTeamProjectsStore } from "./useStore";
import { teamProjectsActions } from "./actions";
import {
  LoadingProjectsState,
  ErrorProjectsState,
  ProjectsList,
  BottomActions,
} from "./components";
import { useMyProjects } from "@/hooks/queries/useProjects";

interface TeamProjectsScreenProps {
  teamId: string;
}

export const TeamProjectsScreen: React.FC<TeamProjectsScreenProps> = ({
  teamId,
}) => {
  const {
    selectedProjects,
    searchQuery,
    filterQuery,
    isUpdating,
    error: teamProjectsError,
  } = useTeamProjectsStore();

  // use for total count
  const { total } = useMyProjects({ includePublic: false });

  const { projects, isLoading, error: projectsError } = useMyProjects({ includePublic: false, searchQuery: filterQuery });
  const error = projectsError?.message || teamProjectsError;

  useEffect(() => {
    teamProjectsActions.loadTeamProjects(teamId);
  }, [teamId]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage 
        title="Projets de l'équipe" 
        subtitle={`${selectedProjects.size} sur ${total} projets sélectionnés`}
      />
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Rechercher un projet..."
          value={searchQuery}
          onChangeText={teamProjectsActions.searchProjects}
          icon="search"
          containerStyle={styles.searchInput}
        />
      </View>

      {isLoading ? (
        <LoadingProjectsState />
      ) : error ? (
        <ErrorProjectsState
          error={error}
          onRetry={() => teamProjectsActions.loadTeamProjects(teamId)}
        />
      ) : (
        <ProjectsList
          projects={projects || []}
          selectedProjects={selectedProjects}
          searchQuery={searchQuery}
          onToggleProject={teamProjectsActions.toggleProject}
        />
      )}

      <BottomActions
        isUpdating={isUpdating}
        onSave={() => teamProjectsActions.saveChanges(teamId)}
        onCancel={() => teamProjectsActions.cancel(teamId)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
});

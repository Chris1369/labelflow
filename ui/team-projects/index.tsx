import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { useTeamProjectsStore } from "./useStore";
import { teamProjectsActions } from "./actions";
import {
  ProjectsHeader,
  LoadingProjectsState,
  ErrorProjectsState,
  ProjectsList,
  BottomActions,
} from "./components";

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

  return (
    <SafeAreaView style={styles.container}>
      <ProjectsHeader
        selectedCount={selectedProjects.size}
        totalCount={allProjects.length}
        searchQuery={searchQuery}
        onSearchChange={teamProjectsActions.searchProjects}
      />

      {isLoading ? (
        <LoadingProjectsState />
      ) : isSearching ? (
        <LoadingProjectsState message="Recherche en cours..." />
      ) : error ? (
        <ErrorProjectsState 
          error={error} 
          onRetry={() => teamProjectsActions.loadTeamProjects(teamId)} 
        />
      ) : (
        <ProjectsList
          projects={filteredProjects}
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
});

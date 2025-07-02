import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { useSelectProjectStore } from "./useStore";
import { selectProjectActions } from "./actions";
import { useMyProjects } from "@/hooks/queries/useProjects";
import { useSettingsStore } from "../settings/useStore";
import {
  HeaderSection,
  LoadingState,
  ErrorState,
  ProjectsList,
  FloatingAddButton,
} from "./components";

export const SelectProjectScreen: React.FC = () => {
  const { filterQuery, searchQuery } =
    useSelectProjectStore();
  const includePublic = useSettingsStore.getState().includePublicProjects;

  const { data: projects, isLoading, error: projectsError, refetch } = useMyProjects({ includePublic, searchQuery: filterQuery });
  const error = projectsError?.message;

  return (
    <SafeAreaView style={styles.container}>
      <HeaderSection
        searchQuery={searchQuery}
        onSearchChange={selectProjectActions.handleSearchChange}
      />

      {isLoading ? (
        <LoadingState text="Chargement des projets..." />
      ) : error ? (
        <ErrorState
          error={error}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <ProjectsList
            projects={projects || []}
            searchQuery={searchQuery}
            onProjectSelect={selectProjectActions.handleProjectSelect}
            onCreateProject={selectProjectActions.createNewProject}
          />
          <FloatingAddButton onPress={selectProjectActions.createNewProject} />
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
});

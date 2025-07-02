import React, { useRef } from "react";
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
  CreateProjectBottomSheet,
  CreateProjectBottomSheetRef,
} from "./components";

export const SelectProjectScreen: React.FC = () => {
  const { filterQuery, searchQuery } =
    useSelectProjectStore();
  const createProjectBottomSheetRef = useRef<CreateProjectBottomSheetRef>(null);
  const includePublic = useSettingsStore.getState().includePublicProjects;

  const { projects, isLoading, error: projectsError, refetch } = useMyProjects({ includePublic, withTeamsProjects: true, searchQuery: filterQuery });
  const error = projectsError?.message;

  const handleCreateProject = () => {
    createProjectBottomSheetRef.current?.open();
  };

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
            onCreateProject={handleCreateProject}
          />
          <FloatingAddButton onPress={handleCreateProject} />
        </>
      )}

      <CreateProjectBottomSheet ref={createProjectBottomSheetRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

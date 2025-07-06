import React, { useRef } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderPage } from "@/components/atoms";
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
  CreateProjectBottomSheet,
  CreateProjectBottomSheetRef,
} from "./components";

export const SelectProjectScreen: React.FC = () => {
  const { filterQuery, searchQuery } = useSelectProjectStore();
  const createProjectBottomSheetRef = useRef<CreateProjectBottomSheetRef>(null);
  const includePublic = useSettingsStore.getState().includePublicProjects;

  const {
    projects,
    isLoading,
    error: projectsError,
    refetch,
  } = useMyProjects({
    includePublic,
    withTeamsProjects: true,
    searchQuery: filterQuery,
  });
  const error = projectsError?.message;

  const handleCreateProject = () => {
    createProjectBottomSheetRef.current?.open();
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <HeaderPage
        title='Projets'
        rightAction={{
          icon: "add-circle-outline",
          onPress: handleCreateProject,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeaderSection
          searchQuery={searchQuery}
          onSearchChange={selectProjectActions.handleSearchChange}
        />

        {isLoading ? (
          <LoadingState text='Chargement des projets...' />
        ) : error ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : (
          <View style={styles.projectsContainer}>
            <ProjectsList
              projects={projects || []}
              searchQuery={searchQuery}
              onProjectSelect={selectProjectActions.handleProjectSelect}
              onCreateProject={handleCreateProject}
            />
          </View>
        )}
      </ScrollView>

      <CreateProjectBottomSheet ref={createProjectBottomSheetRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
  },
  projectsContainer: {
    flex: 1,
  },
});

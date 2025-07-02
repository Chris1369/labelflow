import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderPage } from "@/components/atoms";
import { theme } from "@/types/theme";
import { projectActions } from "./actions";
import { useProjectStore } from "./useStore";
import { useFocusEffect } from "expo-router";
import {
  LabelCounterBottomSheet,
  LabelCounterBottomSheetRef,
} from "@/components/organisms/LabelCounterBottomSheet";
import { buildMenuItems } from "./data";
import { useProjectDetails } from "@/hooks/queries/useProjects";
import {
  ProjectHeader,
  ProjectMenuGrid,
  ProjectLoadingView,
  ProjectErrorView,
  ProjectBottomSection,
} from "./components";

interface ProjectScreenProps {
  projectId: string;
}

export const ProjectScreen: React.FC<ProjectScreenProps> = ({ projectId }) => {
  const { isModalVisible, modalType, error, updateProjectVisibility, setCurrentProject } =
    useProjectStore();
  const {
    data: currentProject,
    refetch,
    isLoading,
  } = useProjectDetails(projectId);
  const labelCounterBottomSheetRef = useRef<LabelCounterBottomSheetRef>(null);

  useEffect(() => {
    if (currentProject) {
      setCurrentProject(currentProject);
    }
  }, [currentProject]);

  useEffect(() => {
    if (isModalVisible && modalType) {
      projectActions.showWarningModal();
    }
  }, [isModalVisible, modalType]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [projectId])
  );


  const menuItems = buildMenuItems(projectId);

  const handleLabelCounterOpen = () => {
    labelCounterBottomSheetRef.current?.open();
  };


  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <HeaderPage 
          title="Projet" 
          subtitle="Chargement..."
        />
        <ProjectLoadingView />
      </SafeAreaView>
    );
  }

  if (error && !currentProject) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <HeaderPage 
          title="Projet" 
          subtitle="Erreur"
        />
        <ProjectErrorView error={error} onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage 
        title={currentProject?.name || 'Projet'} 
        subtitle={currentProject?.description}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <ProjectHeader
            project={currentProject}
            onEyePress={handleLabelCounterOpen}
            onSwitchChange={updateProjectVisibility}
          />
        </View>

        <ProjectMenuGrid menuItems={menuItems} />

        <ProjectBottomSection />
      </ScrollView>

      <LabelCounterBottomSheet
        ref={labelCounterBottomSheetRef}
        labelCounters={currentProject?.labelCounter || []}
      />
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerContainer: {
    marginBottom: theme.spacing.md,
  },
});

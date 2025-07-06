import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderPage } from "@/components/atoms";
import { theme } from "@/types/theme";
import { projectActions } from "./actions";
import { useProjectStore } from "./useStore";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  LabelCounterBottomSheet,
  LabelCounterBottomSheetRef,
} from "@/components/organisms/LabelCounterBottomSheet";
import { buildMenuItems } from "./data";
import { useProjectDetails } from "@/hooks/queries/useProjects";
import {
  ProjectMenuGrid,
  ProjectLoadingView,
  ProjectErrorView,
} from "./components";

interface ProjectScreenProps {
  projectId: string;
}

export const ProjectScreen: React.FC<ProjectScreenProps> = ({ projectId }) => {
  const {
    isModalVisible,
    modalType,
    error,
    setCurrentProject,
    updateProjectVisibility,
  } = useProjectStore();
  const {
    data: currentProject,
    refetch,
    isLoading,
  } = useProjectDetails(projectId);
  const labelCounterBottomSheetRef = useRef<LabelCounterBottomSheetRef>(null);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);

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

  const menuItems = buildMenuItems(projectId, currentProject);

  const handleLabelCounterOpen = () => {
    labelCounterBottomSheetRef.current?.open();
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["left", "right", "bottom"]}
      >
        <HeaderPage title='Projet' subtitle='Chargement...' />
        <ProjectLoadingView />
      </SafeAreaView>
    );
  }

  if (error && !currentProject) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["left", "right", "bottom"]}
      >
        <HeaderPage title='Projet' subtitle='Erreur' />
        <ProjectErrorView error={error} onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }

  console.log(currentProject);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <HeaderPage
        title={currentProject?.name || "Projet"}
        subtitle={currentProject?.description}
        rightAction={{
          icon: "stats-chart-outline",
          onPress: handleLabelCounterOpen,
          badge: currentProject?.labelCounter?.length || 0,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.menuContainer}>
          <ProjectMenuGrid menuItems={menuItems} />
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
    paddingTop: theme.spacing.lg,
  },
  menuContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
});

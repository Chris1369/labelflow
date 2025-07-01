import React, { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { useSettingsStore } from "./useStore";
import { settingsActions } from "./actions";
import {
  SettingsHeader,
  PreferencesSection,
  ModelTrainingSection,
  InfoSection,
} from "./components";

export const SettingsScreen: React.FC = () => {
  const {
    includePublicCategories,
    includePublicLabels,
    includePublicProjects,
    canBeAddedToTeam,
    isTraining,
    setIncludePublicCategories,
    setIncludePublicLabels,
    setIncludePublicProjects,
  } = useSettingsStore();

  useEffect(() => {
    settingsActions.loadUserSettings();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SettingsHeader />
        
        <PreferencesSection
          includePublicCategories={includePublicCategories}
          includePublicLabels={includePublicLabels}
          includePublicProjects={includePublicProjects}
          canBeAddedToTeam={canBeAddedToTeam}
          setIncludePublicCategories={setIncludePublicCategories}
          setIncludePublicLabels={setIncludePublicLabels}
          setIncludePublicProjects={setIncludePublicProjects}
        />
        
        <ModelTrainingSection isTraining={isTraining} />
        
        <InfoSection />
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
});

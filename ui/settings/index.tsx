import React, { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderPage } from "@/components/atoms";
import { theme } from "@/types/theme";
import { useSettingsStore } from "./useStore";
import { settingsActions } from "./actions";
import {
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
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage 
        title="Paramètres" 
        subtitle="Gérez vos préférences"
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
});

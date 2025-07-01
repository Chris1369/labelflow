import React, { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { teamActions } from "./actions";
import { useTeamStore } from "./useStore";
import {
  TeamHeader,
  TeamMenuGrid,
  TeamLoadingView,
  TeamErrorView,
  TeamBottomSection,
  type MenuItemData,
} from "./components";

interface TeamScreenProps {
  teamId: string;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({ teamId }) => {
  const { currentTeam, isLoading, error } = useTeamStore();

  useEffect(() => {
    useTeamStore.getState().loadTeam(teamId);
  }, [teamId]);

  const menuItems: MenuItemData[] = [
    {
      id: "members",
      title: "Gestion des membres",
      description: "Ajouter ou retirer des membres de l'équipe",
      icon: "people",
      onPress: () => teamActions.handleMembers(teamId),
      color: theme.colors.primary,
    },
    {
      id: "projects",
      title: "Gestion des projets",
      description: "Sélectionner ou retirer des projets",
      icon: "folder",
      onPress: () => teamActions.handleProjects(teamId),
      color: theme.colors.info,
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <TeamLoadingView />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <TeamErrorView 
          error={error} 
          onRetry={() => useTeamStore.getState().loadTeam(teamId)} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TeamHeader team={currentTeam} />
        <TeamMenuGrid menuItems={menuItems} />
        <TeamBottomSection />
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

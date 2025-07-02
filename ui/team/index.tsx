import React, { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { useTeamStore } from "./useStore";
import {
  TeamHeader,
  TeamMenuGrid,
  TeamLoadingView,
  TeamErrorView,
  TeamBottomSection,
  type MenuItemData,
} from "./components";
import { useTeamDetails } from "@/hooks/queries";
import { buildMenuItems } from "./data";

interface TeamScreenProps {
  teamId: string;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({ teamId }) => {
  const { setCurrentTeam, currentTeam } = useTeamStore();
  const { data, isLoading, error: teamError, refetch } = useTeamDetails(teamId);
  const error = teamError?.message;

  useEffect(() => {
    setCurrentTeam(data || null);
  }, [data]);

  const menuItems: MenuItemData[] = buildMenuItems(teamId);

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
          onRetry={() => refetch()}
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

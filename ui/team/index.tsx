import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderPage } from "@/components/atoms";
import { theme } from "@/types/theme";
import { useTeamStore } from "./useStore";
import {
  TeamMenuGrid,
  TeamLoadingView,
  TeamErrorView,
  TeamBottomSection,
  TeamMembersBottomSheet,
  TeamProjectsBottomSheet,
  type MenuItemData,
  type TeamMembersBottomSheetRef,
  type TeamProjectsBottomSheetRef,
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
  const membersBottomSheetRef = useRef<TeamMembersBottomSheetRef>(null);
  const projectsBottomSheetRef = useRef<TeamProjectsBottomSheetRef>(null);

  useEffect(() => {
    setCurrentTeam(data || null);
  }, [data]);

  const menuItems: MenuItemData[] = buildMenuItems(
    teamId,
    () => membersBottomSheetRef.current?.open(),
    () => projectsBottomSheetRef.current?.open()
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <HeaderPage 
          title="Équipe" 
          subtitle="Chargement..."
        />
        <TeamLoadingView />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <HeaderPage 
          title="Équipe" 
          subtitle="Erreur"
        />
        <TeamErrorView
          error={error}
          onRetry={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage 
        title={currentTeam?.name || 'Équipe'} 
        subtitle={currentTeam?.description || `${currentTeam?.members?.length || 0} membres`}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TeamMenuGrid menuItems={menuItems} />
        <TeamBottomSection />
      </ScrollView>
      
      <TeamMembersBottomSheet ref={membersBottomSheetRef} teamId={teamId} />
      <TeamProjectsBottomSheet ref={projectsBottomSheetRef} teamId={teamId} />
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

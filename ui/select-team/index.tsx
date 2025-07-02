import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { useSelectTeamStore } from "./useStore";
import { selectTeamActions } from "./actions";
import { useMyTeams } from "@/hooks/queries";
import {
  TeamHeader,
  TeamLoadingState,
  TeamErrorState,
  TeamsList,
  FloatingAddButton,
  CreateTeamBottomSheet,
  CreateTeamBottomSheetRef,
} from "./components";

export const SelectTeamScreen: React.FC = () => {
  const { filteredTeams, searchQuery, isSearching, error, initTeams } =
    useSelectTeamStore();
  const createTeamBottomSheetRef = useRef<CreateTeamBottomSheetRef>(null);

  const { data: teams, isLoading, refetch } = useMyTeams();

  useEffect(() => {
    if (teams) {
      initTeams({ teams, refreshTeams: refetch });
    }
    return () => {
      useSelectTeamStore.getState().resetSelection();
    };
  }, [teams]);

  const handleCreateTeam = () => {
    createTeamBottomSheetRef.current?.open();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TeamHeader
        searchQuery={searchQuery}
        onSearchChange={selectTeamActions.searchTeams}
      />

      {isLoading ? (
        <TeamLoadingState text="Chargement des équipes..." />
      ) : isSearching ? (
        <TeamLoadingState text="Recherche en cours..." />
      ) : error ? (
        <TeamErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <>
          <TeamsList
            teams={filteredTeams}
            searchQuery={searchQuery}
            onTeamSelect={selectTeamActions.selectTeam}
            onCreateTeam={handleCreateTeam}
          />
          <FloatingAddButton onPress={handleCreateTeam} />
        </>
      )}
      
      <CreateTeamBottomSheet ref={createTeamBottomSheetRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

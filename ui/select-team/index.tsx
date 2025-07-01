import React, { useEffect } from "react";
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
} from "./components";

export const SelectTeamScreen: React.FC = () => {
  const { filteredTeams, searchQuery, isSearching, error, initTeams } =
    useSelectTeamStore();

  const { data: teams, isLoading, refetch } = useMyTeams();

  useEffect(() => {
    if (teams) {
      initTeams({ teams, refreshTeams: refetch });
    }
    return () => {
      useSelectTeamStore.getState().resetSelection();
    };
  }, [teams]);

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
            onCreateTeam={selectTeamActions.createNewTeam}
          />
          <FloatingAddButton onPress={selectTeamActions.createNewTeam} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

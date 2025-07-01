import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { homeActions } from "./actions";
import { ErrorDebugPanel } from "@/components/organisms/ErrorDebugPanel";
import { HomeHeader, MenuGrid, type MenuItemData } from "./components";

export const HomeScreen: React.FC = () => {
  const menuItems: MenuItemData[] = [
    {
      id: "projects",
      title: "Projets",
      icon: "folder",
      onPress: homeActions.handleSelectProject,
      color: theme.colors.primary,
    },
    {
      id: "teams",
      title: "Équipes",
      icon: "people",
      onPress: homeActions.handleSelectTeam,
      color: theme.colors.primary,
    },
    {
      id: "dictionary",
      title: "Dictionnaire",
      icon: "book",
      onPress: homeActions.handleDictionary,
      color: theme.colors.primary,
    },
    {
      id: "settings",
      title: "Paramètres",
      icon: "settings",
      onPress: homeActions.handleSettings,
      color: theme.colors.primary,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HomeHeader onLogout={homeActions.handleLogout} />
        <MenuGrid menuItems={menuItems} />
      </ScrollView>
      {__DEV__ && <ErrorDebugPanel />}
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

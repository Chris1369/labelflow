import React from "react";
import { ScrollView, StyleSheet, View, Text, TextStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { homeActions } from "./actions";
import { ErrorDebugPanel } from "@/components/organisms/ErrorDebugPanel";
import { MenuGrid, type MenuItemData } from "./components";
import { HeaderPage } from "@/components/atoms";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProjects } from "@/hooks/queries/useProjects";
import { useMyTeams } from "@/hooks/queries/useTeams";

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { total: projectsCount } = useMyProjects({});
  const { data: teams = [] } = useMyTeams();

  const menuItems: MenuItemData[] = [
    {
      id: "projects",
      title: "Projets",
      subtitle: "Gérer vos projets",
      icon: "folder-outline",
      onPress: homeActions.handleSelectProject,
      color: theme.colors.primary,
      count: projectsCount || 0,
    },
    {
      id: "teams",
      title: "Équipes",
      subtitle: "Collaborer avec vos équipes",
      icon: "people-outline",
      onPress: homeActions.handleSelectTeam,
      color: "#4CAF50",
      count: teams.length,
    },
    {
      id: "dictionary",
      title: "Dictionnaire",
      subtitle: "Catégories et labels",
      icon: "book-outline",
      onPress: homeActions.handleDictionary,
      color: "#2196F3",
      count: undefined,
    },
    {
      id: "settings",
      title: "Paramètres",
      subtitle: "Configurer l'application",
      icon: "settings-outline",
      onPress: homeActions.handleSettings,
      color: "#9C27B0",
      count: undefined,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <HeaderPage
        showBack={false}
        title='Accueil'
        rightAction={{
          icon: "log-out-outline",
          onPress: homeActions.handleLogout,
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText as TextStyle}>Bienvenue,</Text>
          <Text style={styles.userName}>
            {user?.username || user?.name || "Utilisateur"}
          </Text>
          {user?.email && (
            <Text style={styles.userEmail as TextStyle}>{user.email}</Text>
          )}
        </View>

        <View style={styles.menuContainer}>
          <MenuGrid menuItems={menuItems} />
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
  },
  welcomeContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  welcomeText: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    ...theme.fonts.title,
    color: theme.colors.text,
    fontWeight: "700",
  },
  userEmail: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
});

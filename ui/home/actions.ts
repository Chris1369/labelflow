import { router } from "expo-router";
import { useHomeStore } from "./useStore";
import { Alert } from "react-native";

export const homeActions = {
  handleCreateProject: () => {
    useHomeStore.getState().setSelectedMenuItem("create-project");
    router.push("/(main)/create-project");
  },

  handleSelectProject: () => {
    useHomeStore.getState().setSelectedMenuItem("select-project");
    router.push("/(main)/select-project");
  },

  handleCreateTeam: () => {
    useHomeStore.getState().setSelectedMenuItem("create-team");
    router.push("/(main)/create-team");
  },

  handleSelectTeam: () => {
    useHomeStore.getState().setSelectedMenuItem("select-team");
    router.push("/(main)/select-team");
  },

  handleDictionary: () => {
    useHomeStore.getState().setSelectedMenuItem("dictionary");
    router.push("/(main)/dictionary");
  },

  handleSettings: () => {
    useHomeStore.getState().setSelectedMenuItem("settings");
    router.push("/(main)/settings");
  },

  handleHelp: () => {
    useHomeStore.getState().setSelectedMenuItem("help");
    router.push("/(main)/help");
  },

  handleLogout: () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        onPress: () => {
          // TODO: Clear user session
          router.replace("/(auth)/signin");
        },
        style: "destructive",
      },
    ]);
  },
};

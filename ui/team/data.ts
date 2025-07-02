import { theme } from "@/types/theme";
import { MenuItemData } from "./components";
import { teamActions } from "./actions";

export const buildMenuItems = (teamId: string): MenuItemData[] => {
  return [
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
  };
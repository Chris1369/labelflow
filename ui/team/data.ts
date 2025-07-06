import { theme } from "@/types/theme";
import { MenuItemData } from "./components";

export const buildMenuItems = (
  teamId: string,
  onMembersPress: () => void,
  onProjectsPress: () => void
): MenuItemData[] => {
  return [
    {
      id: "members",
      title: "Gestion des membres",
      description: "Ajouter ou retirer des membres de l'équipe",
      icon: "people-outline",
      onPress: onMembersPress,
      color: theme.colors.primary,
    },
    {
      id: "projects",
      title: "Gestion des projets",
      description: "Sélectionner ou retirer des projets",
      icon: "folder-outline",
      onPress: onProjectsPress,
      color: theme.colors.info,
    },
  ];
};
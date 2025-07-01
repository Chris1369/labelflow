import { Ionicons } from "@expo/vector-icons";
import { projectActions } from "./actions";
import { theme } from "@/types/theme";

interface ProjectMenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  variant?: "default" | "warning" | "danger";
}

export const buildMenuItems: (projectId: string) => ProjectMenuItem[] = (projectId) => [
  {
    id: "add-items",
    title: "Ajouter des items",
    icon: "camera",
    onPress: () => projectActions.handleAddItems(projectId),
    color: theme.colors.primary,
  },
  {
    id: "view-items",
    title: "Voir les items",
    icon: "images",
    onPress: () => projectActions.handleViewItems(projectId),
  },
  {
    id: "export",
    title: "Exporter",
    icon: "download",
    onPress: () => projectActions.handleExport(projectId),
  },
  {
    id: "import",
    title: "Labeliser une liste",
    icon: "list",
    onPress: () => projectActions.handleImport(projectId),
  },
  {
    id: "reset",
    title: "Entraîner le modèle",
    icon: "refresh",
    onPress: projectActions.startTraining,
    color: theme.colors.warning,
    variant: "warning",
  },
  {
    id: "delete",
    title: "Supprimer",
    icon: "trash",
    onPress: projectActions.handleDelete,
    color: theme.colors.error,
    variant: "danger",
  },
];

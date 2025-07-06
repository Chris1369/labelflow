import { Ionicons } from "@expo/vector-icons";
import { projectActions } from "./actions";
import { theme } from "@/types/theme";
import { Project } from "@/types/project";

interface ProjectMenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  variant?: "default" | "warning" | "danger";
  count?: number;
}

export const buildMenuItems: (
  projectId: string,
  project?: Project | null
) => ProjectMenuItem[] = (projectId, project) => [
  {
    id: "add-items",
    title: "Ajouter",
    subtitle: "Capturer de nouvelles images",
    icon: "camera-outline",
    onPress: () => projectActions.handleAddItems(projectId),
    color: theme.colors.primary,
    count: 0,
  },
  {
    id: "view-items",
    title: "Voir",
    subtitle: "Parcourir vos images",
    icon: "images-outline",
    onPress: () => projectActions.handleViewItems(projectId),
    color: "#2196F3",
    count: project?.items?.length || 0,
  },
  {
    id: "export",
    title: "Exporter",
    subtitle: "Télécharger vos données",
    icon: "download-outline",
    onPress: () => projectActions.handleExport(projectId),
    color: "#4CAF50",
  },
  {
    id: "import",
    title: "Labeliser",
    subtitle: "Annoter une liste d'images",
    icon: "list-outline",
    onPress: () => projectActions.handleImport(projectId),
    color: "#9C27B0",
    count: project?.unlabeledList?.length || 0,
  },
  {
    id: "reset",
    title: "Entraîner",
    subtitle: "Lancer l'entraînement",
    icon: "refresh-outline",
    onPress: projectActions.startTraining,
    color: theme.colors.warning,
    variant: "warning",
  },
  {
    id: "delete",
    title: "Supprimer",
    subtitle: "Effacer ce projet et ses items",
    icon: "trash-outline",
    onPress: projectActions.handleDelete,
    color: theme.colors.error,
    variant: "danger",
  },
];

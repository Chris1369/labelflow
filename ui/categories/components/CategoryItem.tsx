import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/types/category";
import { Label } from "@/types/label";
import { theme } from "@/types/theme";
import { AddLabelsModal } from "./AddLabelsModal";
import { categoryAPI } from "@/api/category.api";

interface CategoryItemProps {
  category: Category;
  labels: Label[];
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onLabelsUpdated?: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  labels,
  isExpanded,
  onToggle,
  onDelete,
  onLabelsUpdated,
}) => {
  const [isAddLabelsModalVisible, setIsAddLabelsModalVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(category.isPublic);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la catégorie",
      `Êtes-vous sûr de vouloir supprimer "${category.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: onDelete,
          style: "destructive",
        },
      ]
    );
  };

  const handleTogglePublic = async (value: boolean) => {
    try {
      setIsUpdating(true);
      setIsPublic(value);

      const categoryId = category._id || category.id;
      await categoryAPI.update(categoryId, { isPublic: value });

      if (onLabelsUpdated) {
        onLabelsUpdated();
      }
    } catch (error) {
      console.error("Error updating category visibility:", error);
      setIsPublic(!value);
      Alert.alert(
        "Erreur",
        "Impossible de modifier la visibilité de la catégorie"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name='grid-outline'
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName} numberOfLines={1}>
              {category.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name='trash-outline'
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {category.description && (
          <Text style={styles.categoryDescription} numberOfLines={2}>
            {category.description}
          </Text>
        )}

        <View style={styles.categoryStats}>
          <View style={styles.stat}>
            <Ionicons
              name='pricetags'
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.statText}>
              {category.labels?.length || 0} labels
            </Text>
          </View>
          <View style={styles.stat}>
            <Ionicons
              name={isPublic ? "globe-outline" : "lock-closed-outline"}
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.statText}>{isPublic ? "Public" : "Privé"}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons
              name='calendar'
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.statText}>
              {new Date(category.createdAt).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.labelsContainer}>
            {labels && labels.length > 0 ? (
              labels.map((label) => (
                <View key={label.id} style={styles.labelChip}>
                  <Text style={styles.labelText}>{label.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                Aucun label dans cette catégorie
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.addLabelButton}
            onPress={() => setIsAddLabelsModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name='add-circle-outline'
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.addLabelText}>Ajouter des labels</Text>
          </TouchableOpacity>
        </View>
      )}

      <AddLabelsModal
        isVisible={isAddLabelsModalVisible}
        onClose={() => setIsAddLabelsModalVisible(false)}
        category={category}
        onLabelsUpdated={() => {
          onLabelsUpdated?.();
          onToggle();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  categoryInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  categoryName: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
  },
  publicBadge: {
    backgroundColor: theme.colors.info + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  publicText: {
    ...theme.fonts.label,
    color: theme.colors.info,
  },
  categoryDescription: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  categoryStats: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  expandedContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  addLabelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
    borderStyle: "dashed",
  },
  addLabelText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  labelChip: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  labelText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
});

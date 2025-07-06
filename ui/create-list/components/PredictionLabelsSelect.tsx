import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { SimpleBottomSheet } from "@/components/molecules/SimpleBottomSheet";
import { useMyLabels } from "@/hooks/queries";
import { ActivityIndicator } from "react-native";
import { unlabeledListAPI } from "@/api/unlabeledList.api";

interface PredictionLabelsSelectProps {
  projectId: string;
  selectedLabels: string[];
  onLabelsChange: (labels: string[]) => void;
  isCreating?: boolean;
  mode?: "create" | "add";
  listId?: string;
}

export const PredictionLabelsSelect: React.FC<PredictionLabelsSelectProps> = ({
  projectId,
  selectedLabels,
  onLabelsChange,
  isCreating = false,
  mode = "create",
  listId,
}) => {
  const [visible, setVisible] = React.useState(false);
  const { data: labels = [], isLoading } = useMyLabels(true, true);

  const handleToggleLabel = (labelId: string) => {
    if (selectedLabels.includes(labelId)) {
      onLabelsChange(selectedLabels.filter((id) => id !== labelId));
    } else {
      onLabelsChange([...selectedLabels, labelId]);
    }
  };

  const getSelectedLabelsDisplay = () => {
    if (selectedLabels.length === 0) {
      return "Aucun label sélectionné";
    }

    const selectedLabelNames = labels
      .filter((label) => selectedLabels.includes(label._id || label.id))
      .map((label) => label.name);

    if (selectedLabelNames.length <= 2) {
      return selectedLabelNames.join(", ");
    }

    return `${selectedLabelNames.slice(0, 2).join(", ")} +${
      selectedLabelNames.length - 2
    }`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Labels de prédiction</Text>
      <Text style={styles.description}>
        Sélectionnez les labels qui seront utilisés pour la prédiction
        automatique
      </Text>

      <TouchableOpacity
        style={[styles.selectButton, isCreating && styles.selectButtonDisabled]}
        onPress={() => setVisible(true)}
        disabled={isCreating}
        activeOpacity={0.7}
      >
        <View style={styles.selectContent}>
          <View style={styles.selectInfo}>
            <Ionicons
              name='pricetag-outline'
              size={20}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <Text style={styles.selectText} numberOfLines={1}>
              {getSelectedLabelsDisplay()}
            </Text>
          </View>
          {selectedLabels.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{selectedLabels.length}</Text>
            </View>
          )}
        </View>
        <Ionicons
          name='chevron-forward'
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      <SimpleBottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        height='80%'
      >
        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Sélectionner les labels</Text>
            <Text style={styles.bottomSheetSubtitle}>
              Choisissez les labels pour la prédiction automatique
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color={theme.colors.primary} />
            </View>
          ) : labels.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name='pricetag-outline'
                size={60}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.emptyTitle}>Aucun label disponible</Text>
              <Text style={styles.emptyText}>
                Créez des labels dans la section Labels pour les utiliser ici
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.labelsList}
              showsVerticalScrollIndicator={false}
            >
              {labels.map((label) => {
                const labelId = label._id || label.id;
                const isSelected = selectedLabels.includes(labelId);

                return (
                  <TouchableOpacity
                    key={labelId}
                    style={[
                      styles.labelItem,
                      isSelected && styles.labelItemSelected,
                    ]}
                    onPress={() => handleToggleLabel(labelId)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.labelContent}>
                      <View
                        style={[
                          styles.labelColor,
                          {
                            backgroundColor:
                              label.color || theme.colors.primary,
                          },
                        ]}
                      />
                      <Text style={styles.labelName}>{label.name}</Text>
                    </View>

                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && (
                        <Ionicons
                          name='checkmark'
                          size={16}
                          color={theme.colors.background}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.bottomSheetFooter}>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={async () => {
                setVisible(false);
                // Save prediction labels automatically in add mode
                if (mode === "add" && listId) {
                  try {
                    console.log("Saving prediction labels for list:", listId);
                    console.log("Selected prediction labels:", selectedLabels);
                    await unlabeledListAPI.update(listId, {
                      labelsListPredictions: selectedLabels,
                    });
                    console.log("Prediction labels saved successfully");
                  } catch (error) {
                    console.error("Error saving prediction labels:", error);
                  }
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Terminé</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.fonts.body,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectButtonDisabled: {
    opacity: 0.6,
  },
  selectContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  selectText: {
    ...theme.fonts.body,
    color: theme.colors.text,
    flex: 1,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: theme.spacing.sm,
  },
  badgeText: {
    ...theme.fonts.caption,
    color: theme.colors.background,
    fontWeight: "600",
  },
  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetHeader: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  bottomSheetTitle: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  bottomSheetSubtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  labelsList: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  labelItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  labelItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  labelContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  labelColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: theme.spacing.sm,
  },
  labelName: {
    ...theme.fonts.body,
    color: theme.colors.text,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  bottomSheetFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  doneButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  doneButtonText: {
    ...theme.fonts.button,
    color: theme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
  },
});

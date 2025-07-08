import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextStyle,
} from "react-native";
import { Input, Button } from "@/components/atoms";
import { SimpleBottomSheet } from "@/components/molecules";
import { theme } from "@/types/theme";
import { categoryAPI } from "@/api/category.api";
import { useAddLabelsModalStore } from "./addLabelsModal.store";
import { AddLabelsModalProps } from "./addLabelsModal.types";
import { Label } from "@/types/label";
import { useMyLabels } from "@/hooks/queries";

export const AddLabelsModal: React.FC<AddLabelsModalProps> = ({
  isVisible,
  onClose,
  category,
  onLabelsUpdated,
}) => {
  const {
    filteredLabels,
    selectedLabelIds,
    searchQuery,
    isSubmitting,
    error,
    initLabels,
    setSearchQuery,
    toggleLabelSelection,
    setInitialSelectedLabels,
    resetSelection,
    getNewlySelectedLabels,
    getLabelsToRemove,
  } = useAddLabelsModalStore();

  const { data: labels, isLoading } = useMyLabels(true, isVisible);

  useEffect(() => {
    if (isVisible) {
      // Load all labels and set initial selection
      if (labels) {
        initLabels(labels);
      }
      // Extract label IDs from the category labels (can be strings or Label objects)
      const labelIds = (category.labels || []).map((label) =>
        typeof label === "string" ? label : label.id
      );
      setInitialSelectedLabels(labelIds);
    } else {
      // Reset when modal closes
      resetSelection();
    }
  }, [isVisible, category.labels, labels]);

  const handleSubmit = async () => {
    // Extract label IDs from the category labels
    const existingLabelIds = (category.labels || []).map((label) =>
      typeof label === "string" ? label : label.id
    );
    const newlySelectedLabels = getNewlySelectedLabels(existingLabelIds);
    const labelsToRemove = getLabelsToRemove(existingLabelIds);

    if (newlySelectedLabels.length === 0 && labelsToRemove.length === 0) {
      Alert.alert("Info", "Aucune modification détectée");
      return;
    }

    useAddLabelsModalStore.setState({ isSubmitting: true });

    try {
      // Get the final list of label IDs
      const finalLabelIds = Array.from(selectedLabelIds);

      // Update the category with the new label list
      await categoryAPI.update(category.id, {
        labels: finalLabelIds,
      });

      const message = [];
      if (newlySelectedLabels.length > 0) {
        message.push(`${newlySelectedLabels.length} label(s) ajouté(s)`);
      }
      if (labelsToRemove.length > 0) {
        message.push(`${labelsToRemove.length} label(s) supprimé(s)`);
      }

      Alert.alert("Succès", message.join(" et "));
      onLabelsUpdated();
      onClose();
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de modifier les labels"
      );
    } finally {
      useAddLabelsModalStore.setState({ isSubmitting: false });
    }
  };

  const renderLabelItem = ({ item }: { item: Label }) => {
    const isSelected = selectedLabelIds.has(item.id);
    // Check if the label is already in the category
    const isExisting = category.labels?.some((label) =>
      typeof label === "string" ? label === item.id : label.id === item.id
    );

    // Determine the state of the label
    const willBeRemoved = isExisting && !isSelected;
    const willBeAdded = !isExisting && isSelected;
    const willRemainInCategory = isExisting && isSelected;

    return (
      <TouchableOpacity
        style={[
          styles.labelItem,
          willBeAdded && styles.labelItemWillBeAdded,
          willBeRemoved && styles.labelItemWillBeRemoved,
          willRemainInCategory && styles.labelItemExisting,
        ]}
        onPress={() => toggleLabelSelection(item.id)}
        disabled={false}
      >
        <View style={styles.labelInfo}>
          <Text
            style={[
              styles.labelName,
              willBeAdded && styles.labelNameWillBeAdded,
              willBeRemoved && styles.labelNameWillBeRemoved,
              willRemainInCategory && styles.labelNameExisting,
            ]}
          >
            {item.name}
          </Text>
          {item.isPublic && <Text style={styles.publicBadge}>Public</Text>}
          {willBeAdded && <Text style={styles.statusBadge}>À ajouter</Text>}
          {willBeRemoved && (
            <Text style={styles.statusBadgeRemove}>À retirer</Text>
          )}
        </View>
        <View
          style={[
            styles.checkbox,
            isSelected && styles.checkboxSelected,
            willBeRemoved && styles.checkboxWillBeRemoved,
          ]}
        >
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
          {willBeRemoved && <Text style={styles.checkmarkRemove}>−</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SimpleBottomSheet visible={isVisible} onClose={onClose} height='90%'>
      <View style={styles.container}>
        <View style={styles.fixedHeader}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Gérer les labels de "{category.name}"
            </Text>

            <Text style={styles.subtitle}>
              Sélectionnez ou désélectionnez les labels
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <Input
              placeholder='Rechercher des labels...'
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={styles.searchInput}
            />
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: theme.colors.success },
                  ]}
                />
                <Text style={styles.legendText}>À ajouter</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: theme.colors.info },
                  ]}
                />
                <Text style={styles.legendText}>Reste</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: theme.colors.error },
                  ]}
                />
                <Text style={styles.legendText}>À retirer</Text>
              </View>
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color={theme.colors.primary} />
              <Text style={styles.loadingText}>Chargement des labels...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredLabels}
              keyExtractor={(item) => item.id}
              renderItem={renderLabelItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps='handled'
              keyboardDismissMode='interactive'
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? "Aucun label trouvé"
                    : "Aucun label disponible"}
                </Text>
              }
            />
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>

          <Button
            title={isSubmitting ? "Enregistrement..." : "Enregistrer"}
            onPress={handleSubmit}
            disabled={isSubmitting || isLoading}
            style={styles.submitButton}
          />
        </View>
      </View>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    flexShrink: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
  } as TextStyle,
  title: {
    ...theme.fonts.subtitle,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  } as TextStyle,
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  subtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    paddingHorizontal: theme.spacing.lg,
  } as TextStyle,
  searchContainer: {
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  searchInput: {
    marginBottom: 0,
  },
  legendContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    marginBottom: theme.spacing.sm,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  } as TextStyle,
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.sm,
  },
  listContainer: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
  labelItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  labelItemWillBeAdded: {
    backgroundColor: theme.colors.success + "10",
    borderColor: theme.colors.success,
  },
  labelItemWillBeRemoved: {
    backgroundColor: theme.colors.error + "10",
    borderColor: theme.colors.error,
  },
  labelItemExisting: {
    backgroundColor: theme.colors.info + "10",
    borderColor: theme.colors.info,
  },
  labelInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  labelName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  labelNameWillBeAdded: {
    color: theme.colors.success,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  labelNameWillBeRemoved: {
    color: theme.colors.error,
    fontWeight: "600" as TextStyle["fontWeight"],
    textDecorationLine: "line-through",
  },
  labelNameExisting: {
    color: theme.colors.info,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  publicBadge: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  statusBadge: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.success,
    backgroundColor: theme.colors.success + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  statusBadgeRemove: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
    backgroundColor: theme.colors.error + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  checkboxWillBeRemoved: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    fontWeight: "bold",
  },
  checkmarkRemove: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.xl,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  cancelText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  submitButton: {
    flex: 1,
  },
});

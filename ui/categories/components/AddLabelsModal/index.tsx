import React, { useEffect } from "react";
import { View } from "react-native";
import { SimpleBottomSheet } from "@/components/molecules";
import { useMyLabels } from "@/hooks/queries";
import { AddLabelsModalProps } from "./types";
import {
  HeaderSection,
  LegendSection,
  LabelList,
  ActionButtons,
} from "./components";
import { useAddLabelsModalStore, useSubmitLabels } from "./hooks";
import { styles } from "./styles";

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

  const { handleSubmit } = useSubmitLabels({
    category,
    selectedLabelIds,
    getNewlySelectedLabels,
    getLabelsToRemove,
    setIsSubmitting: (value) => useAddLabelsModalStore.setState({ isSubmitting: value }),
    onLabelsUpdated,
    onClose,
  });

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

  return (
    <SimpleBottomSheet visible={isVisible} onClose={onClose} height="90%">
      <View style={styles.container}>
        <HeaderSection
          categoryName={category.name}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          error={error}
        />

        <LegendSection />

        <LabelList
          labels={filteredLabels}
          selectedLabelIds={selectedLabelIds}
          categoryLabels={category.labels || []}
          onToggleLabelSelection={toggleLabelSelection}
          searchQuery={searchQuery}
          isLoading={isLoading}
        />

        <ActionButtons
          onClose={onClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
        />
      </View>
    </SimpleBottomSheet>
  );
};
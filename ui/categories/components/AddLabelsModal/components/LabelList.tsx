import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { theme } from "@/types/theme";
import { LabelListProps } from "../types";
import { LabelItem } from "./LabelItem";
import { labelListStyles } from "../styles/labelList.styles";

export const LabelList: React.FC<LabelListProps & { isLoading?: boolean }> = ({
  labels,
  selectedLabelIds,
  categoryLabels,
  onToggleLabelSelection,
  searchQuery,
  isLoading,
}) => {
  const renderLabelItem = ({ item }: { item: any }) => {
    const isSelected = selectedLabelIds.has(item.id);
    // Check if the label is already in the category
    const isExisting = categoryLabels?.some((label) =>
      typeof label === "string" ? label === item.id : label.id === item.id
    );

    return (
      <LabelItem
        item={item}
        isSelected={isSelected}
        isExisting={isExisting || false}
        onToggle={onToggleLabelSelection}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={labelListStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={labelListStyles.loadingText}>
          Chargement des labels...
        </Text>
      </View>
    );
  }

  return (
    <View style={labelListStyles.container}>
      <FlatList
        data={labels}
        keyExtractor={(item) => item.id}
        renderItem={renderLabelItem}
        contentContainerStyle={labelListStyles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        ListEmptyComponent={
          <Text style={labelListStyles.emptyText}>
            {searchQuery ? "Aucun label trouvé" : "Aucun label disponible"}
          </Text>
        }
      />
    </View>
  );
};
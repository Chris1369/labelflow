import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";
import { SearchSectionProps } from "../types";
import { searchSectionStyles } from "../styles/searchSection.styles";
import { theme } from "@/types/theme";

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  onSearchChange,
  filteredLabels,
  isCreating,
  onAddCustomLabel,
}) => {
  const shouldShowAddButton =
    searchQuery.trim() &&
    !filteredLabels.some(
      (l) => l.name.toLowerCase() === searchQuery.toLowerCase()
    );

  return (
    <View style={searchSectionStyles.searchContainer}>
      <Input
        placeholder="Rechercher ou ajouter un label..."
        value={searchQuery}
        onChangeText={onSearchChange}
        icon="search-outline"
      />
      {shouldShowAddButton && (
        <View style={searchSectionStyles.addLabelContainer}>
          <TouchableOpacity
            style={[
              searchSectionStyles.addButton,
              isCreating && searchSectionStyles.addButtonDisabled,
            ]}
            onPress={onAddCustomLabel}
            disabled={isCreating}
          >
            <Ionicons
              name="add-circle"
              size={24}
              color={
                isCreating
                  ? theme.colors.textSecondary
                  : theme.colors.primary
              }
            />
            <Text
              style={[
                searchSectionStyles.addButtonText,
                isCreating && searchSectionStyles.addButtonTextDisabled,
              ]}
            >
              {isCreating ? "Création..." : `Ajouter "${searchQuery}"`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
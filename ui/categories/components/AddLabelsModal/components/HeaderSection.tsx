import React from "react";
import { View, Text } from "react-native";
import { Input } from "@/components/atoms";
import { HeaderSectionProps } from "../types";
import { headerStyles } from "../styles/header.styles";

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  categoryName,
  searchQuery,
  onSearchChange,
  error,
}) => {
  return (
    <View style={headerStyles.fixedHeader}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>
          Gérer les labels de "{categoryName}"
        </Text>
        <Text style={headerStyles.subtitle}>
          Sélectionnez ou désélectionnez les labels
        </Text>
      </View>

      <View style={headerStyles.searchContainer}>
        <Input
          placeholder="Rechercher des labels..."
          value={searchQuery}
          onChangeText={onSearchChange}
          containerStyle={headerStyles.searchInput}
        />
      </View>

      {error && <Text style={headerStyles.errorText}>{error}</Text>}
    </View>
  );
};
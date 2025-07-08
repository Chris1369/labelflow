import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CategoryChipProps } from "../types";
import { categoryChipStyles } from "../styles/categoryChip.styles";

export const CategoryChip: React.FC<CategoryChipProps> = ({
  item,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        categoryChipStyles.categoryChip,
        isSelected && categoryChipStyles.categoryChipActive,
      ]}
      onPress={() => onPress(item.name === "Tous" ? null : item.id)}
    >
      <View style={categoryChipStyles.categoryContent}>
        <Text
          style={[
            categoryChipStyles.categoryText,
            isSelected && categoryChipStyles.categoryTextActive,
          ]}
        >
          {item.name}
        </Text>
        {item.isDynamic && (
          <View style={categoryChipStyles.dynamicIndicator} />
        )}
      </View>
    </TouchableOpacity>
  );
};
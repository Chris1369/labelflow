import React from "react";
import { FlatList } from "react-native";
import { CategoryListProps } from "../types";
import { CategoryChip } from "./CategoryChip";
import { categoryListStyles } from "../styles/categoryList.styles";

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  visible,
}) => {
  if (!visible) return null;

  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CategoryChip
          item={item}
          isSelected={selectedCategory === item.id}
          onPress={onSelectCategory}
        />
      )}
      style={categoryListStyles.categoriesList}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center" }}
    />
  );
};
import React from "react";
import { FlatList, Text } from "react-native";
import { LabelListProps } from "../types";
import { LabelItem } from "./LabelItem";
import { labelListStyles } from "../styles/labelList.styles";

export const LabelList: React.FC<LabelListProps> = ({
  labels,
  labelCounters,
  onSelectLabel,
  isSearching,
}) => {
  return (
    <FlatList
      data={labels}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <LabelItem
          item={item}
          labelCounters={labelCounters}
          onSelect={onSelectLabel}
        />
      )}
      style={labelListStyles.labelsList}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text style={labelListStyles.emptyText}>
          {isSearching ? "Recherche en cours..." : "Aucun label trouvé"}
        </Text>
      }
    />
  );
};
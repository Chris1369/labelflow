import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LabelItemProps } from "../types";
import { labelItemStyles } from "../styles/labelItem.styles";

export const LabelItem: React.FC<LabelItemProps> = ({
  item,
  isSelected,
  isExisting,
  onToggle,
}) => {
  // Determine the state of the label
  const willBeRemoved = isExisting && !isSelected;
  const willBeAdded = !isExisting && isSelected;
  const willRemainInCategory = isExisting && isSelected;

  return (
    <TouchableOpacity
      style={[
        labelItemStyles.labelItem,
        willBeAdded && labelItemStyles.labelItemWillBeAdded,
        willBeRemoved && labelItemStyles.labelItemWillBeRemoved,
        willRemainInCategory && labelItemStyles.labelItemExisting,
      ]}
      onPress={() => onToggle(item.id)}
    >
      <View style={labelItemStyles.labelInfo}>
        <Text
          style={[
            labelItemStyles.labelName,
            willBeAdded && labelItemStyles.labelNameWillBeAdded,
            willBeRemoved && labelItemStyles.labelNameWillBeRemoved,
            willRemainInCategory && labelItemStyles.labelNameExisting,
          ]}
        >
          {item.name}
        </Text>
        {item.isPublic && (
          <Text style={labelItemStyles.publicBadge}>Public</Text>
        )}
        {willBeAdded && (
          <Text style={labelItemStyles.statusBadge}>À ajouter</Text>
        )}
        {willBeRemoved && (
          <Text style={labelItemStyles.statusBadgeRemove}>À retirer</Text>
        )}
      </View>
      <View
        style={[
          labelItemStyles.checkbox,
          isSelected && labelItemStyles.checkboxSelected,
          willBeRemoved && labelItemStyles.checkboxWillBeRemoved,
        ]}
      >
        {isSelected && <Text style={labelItemStyles.checkmark}>✓</Text>}
        {willBeRemoved && (
          <Text style={labelItemStyles.checkmarkRemove}>−</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
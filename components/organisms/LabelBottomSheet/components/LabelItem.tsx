import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LabelItemProps } from "../types";
import { labelItemStyles } from "../styles/labelItem.styles";

export const LabelItem: React.FC<LabelItemProps> = ({
  item,
  labelCounters,
  onSelect,
}) => {
  // Find the counter for this label
  const labelCounter = labelCounters.find(
    (counter) => counter.label.toLowerCase() === item.name.toLowerCase()
  );

  return (
    <TouchableOpacity
      style={[
        labelItemStyles.labelItem,
        item.isRecent && labelItemStyles.recentLabelItem,
      ]}
      onPress={() => onSelect(item)}
    >
      <View style={labelItemStyles.labelContent}>
        {item.isDynamic && (
          <View style={labelItemStyles.dynamicLabelIndicator} />
        )}
        <Text style={labelItemStyles.labelText}>{item.name}</Text>
      </View>

      <View style={labelItemStyles.labelRightContent}>
        {labelCounter && (
          <View style={labelItemStyles.counterBadge}>
            <Text style={labelItemStyles.counterText}>
              {labelCounter.count}
            </Text>
          </View>
        )}
        <Text
          style={[
            labelItemStyles.labelCategory,
            item.isRecent && labelItemStyles.recentLabelCategory,
          ]}
        >
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
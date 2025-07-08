import React from "react";
import { View, Text } from "react-native";
import { theme } from "@/types/theme";
import { legendStyles } from "../styles/legend.styles";

export const LegendSection: React.FC = () => {
  return (
    <View style={legendStyles.container}>
      <View style={legendStyles.row}>
        <View style={legendStyles.item}>
          <View
            style={[
              legendStyles.dot,
              { backgroundColor: theme.colors.success },
            ]}
          />
          <Text style={legendStyles.text}>À ajouter</Text>
        </View>
        <View style={legendStyles.item}>
          <View
            style={[
              legendStyles.dot,
              { backgroundColor: theme.colors.info },
            ]}
          />
          <Text style={legendStyles.text}>Reste</Text>
        </View>
        <View style={legendStyles.item}>
          <View
            style={[
              legendStyles.dot,
              { backgroundColor: theme.colors.error },
            ]}
          />
          <Text style={legendStyles.text}>À retirer</Text>
        </View>
      </View>
    </View>
  );
};
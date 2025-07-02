import React from "react";
import { View, Text, StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

interface HeaderProps {
  mode: "create" | "add";
}

export const Header: React.FC<HeaderProps> = ({ mode }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        {mode === "add" ? "Ajouter des images" : "Créer une liste"}
      </Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    ...theme.fonts.subtitle,
  } as TextStyle,
  placeholder: {
    width: 40,
  },
});

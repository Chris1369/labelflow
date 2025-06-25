import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Button } from "@/components/atoms";
import { theme } from "@/types/theme";
import { addItemsActions } from "../actions";

interface PermissionViewProps {
  hasPermission: boolean | null;
}

export const PermissionView: React.FC<PermissionViewProps> = ({ hasPermission }) => {
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPermissionText}>Pas d'accès à la caméra</Text>
        <Button
          title="Demander la permission"
          onPress={addItemsActions.requestCameraPermission}
          style={styles.permissionButton}
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  noPermissionText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  permissionButton: {
    alignSelf: "center",
  },
});
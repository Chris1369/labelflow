import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { PermissionViewProps } from "../types";
import { permissionStyles } from "../styles/permission.styles";

export const PermissionView: React.FC<PermissionViewProps> = ({
  hasPermission,
  permissionGranted,
  onRequestPermission,
}) => {
  if (!hasPermission) {
    return (
      <View style={permissionStyles.centerContent}>
        <Text style={permissionStyles.text}>Chargement...</Text>
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={permissionStyles.centerContent}>
        <Ionicons
          name="scan"
          size={64}
          color={theme.colors.textSecondary}
        />
        <Text style={permissionStyles.text}>
          Pas d'accès à la caméra
        </Text>
        <TouchableOpacity
          style={permissionStyles.button}
          onPress={onRequestPermission}
        >
          <Text style={permissionStyles.buttonText}>
            Autoriser la caméra
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};
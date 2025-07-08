import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { ScanResultProps } from "../types";
import { scanResultStyles } from "../styles/scanResult.styles";

export const ScanResult: React.FC<ScanResultProps> = ({
  scannedData,
  onConfirm,
  onRescan,
}) => {
  return (
    <View style={scanResultStyles.container}>
      <View style={scanResultStyles.card}>
        <View style={scanResultStyles.iconContainer}>
          <Ionicons
            name="qr-code"
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <Text style={scanResultStyles.label}>Code scanné</Text>
        <Text style={scanResultStyles.value} numberOfLines={2}>
          {scannedData}
        </Text>
      </View>

      <View style={scanResultStyles.actionButtons}>
        <TouchableOpacity
          style={[scanResultStyles.actionButton, scanResultStyles.confirmButton]}
          onPress={onConfirm}
        >
          <Ionicons
            name="checkmark"
            size={20}
            color={theme.colors.secondary}
          />
          <Text style={scanResultStyles.confirmButtonText}>Ajouter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[scanResultStyles.actionButton, scanResultStyles.secondaryButton]}
          onPress={onRescan}
        >
          <Ionicons
            name="refresh"
            size={20}
            color={theme.colors.text}
          />
          <Text style={scanResultStyles.secondaryButtonText}>
            Rescanner
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
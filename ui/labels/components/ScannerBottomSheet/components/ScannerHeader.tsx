import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { ScannerHeaderProps } from "../types";
import { headerStyles } from "../styles/header.styles";

export const ScannerHeader: React.FC<ScannerHeaderProps> = ({
  showManualInput,
  onToggleManualInput,
  onClose,
}) => {
  return (
    <View style={headerStyles.header}>
      <TouchableOpacity
        style={[
          headerStyles.headerButton,
          showManualInput && headerStyles.activeHeaderButton,
        ]}
        onPress={onToggleManualInput}
      >
        {showManualInput ? (
          <Ionicons
            name="scan-outline"
            size={24}
            color={theme.colors.text}
          />
        ) : (
          <Text style={headerStyles.abcText}>ABC</Text>
        )}
      </TouchableOpacity>

      <Text style={headerStyles.title}>
        {showManualInput ? "Saisie manuelle" : "Scanner un code"}
      </Text>

      <TouchableOpacity
        style={headerStyles.headerButton}
        onPress={onClose}
      >
        <Ionicons name="close" size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};
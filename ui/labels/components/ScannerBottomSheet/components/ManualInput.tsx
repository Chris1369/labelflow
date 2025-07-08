import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "@/components/atoms";
import { ManualInputProps } from "../types";
import { manualInputStyles } from "../styles/manualInput.styles";

export const ManualInput: React.FC<ManualInputProps> = ({
  manualCode,
  onChangeText,
  onSubmit,
}) => {
  return (
    <View style={manualInputStyles.container}>
      <Text style={manualInputStyles.title}>
        Saisir le code manuellement
      </Text>
      <Input
        placeholder="Entrez le code..."
        value={manualCode}
        onChangeText={onChangeText}
        containerStyle={manualInputStyles.input}
      />
      <TouchableOpacity
        style={manualInputStyles.submitButton}
        onPress={onSubmit}
        disabled={!manualCode.trim()}
      >
        <Text style={manualInputStyles.submitButtonText}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );
};
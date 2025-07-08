import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "@/components/atoms";
import { ActionButtonsProps } from "../types";
import { actionButtonsStyles } from "../styles/actionButtons.styles";

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onClose,
  onSubmit,
  isSubmitting,
  isLoading,
}) => {
  return (
    <View style={actionButtonsStyles.container}>
      <TouchableOpacity
        style={actionButtonsStyles.cancelButton}
        onPress={onClose}
        disabled={isSubmitting}
      >
        <Text style={actionButtonsStyles.cancelText}>Annuler</Text>
      </TouchableOpacity>

      <Button
        title={isSubmitting ? "Enregistrement..." : "Enregistrer"}
        onPress={onSubmit}
        disabled={isSubmitting || isLoading}
        style={actionButtonsStyles.submitButton}
      />
    </View>
  );
};
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { theme } from "@/types/theme";
import { LoadingSectionProps } from "../types";
import { loadingStyles } from "../styles/loading.styles";

export const LoadingSection: React.FC<LoadingSectionProps> = ({ message }) => {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size='large' color={theme.colors.primary} />
      <Text style={loadingStyles.text}>{message}</Text>
    </View>
  );
};
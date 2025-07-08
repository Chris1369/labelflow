import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HeaderPage } from "@/components/atoms";
import { theme } from "@/types/theme";
import { UnlabeledListEmptySectionProps } from "../types";
import { emptyListStyles } from "../styles/emptyList.styles";

export const UnlabeledListEmptySection: React.FC<UnlabeledListEmptySectionProps> = ({
  projectId,
  unlabeledListId,
}) => {
  return (
    <SafeAreaView style={emptyListStyles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage
        title="Liste vide"
        subtitle="Aucune image à labelliser"
      />
      <View style={emptyListStyles.contentContainer}>
        <Ionicons
          name='images-outline'
          size={80}
          color={theme.colors.textSecondary}
        />
        <Text style={emptyListStyles.title}>Liste vide</Text>
        <Text style={emptyListStyles.text}>
          Cette liste ne contient aucune image à labelliser
        </Text>
        <TouchableOpacity
          style={emptyListStyles.addImagesButton}
          onPress={() => {
            router.push({
              pathname: "/(project)/[id]/create-list",
              params: {
                id: projectId,
                mode: "add",
                listId: unlabeledListId,
              },
            });
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name='add-circle-outline'
            size={24}
            color={theme.colors.secondary}
          />
          <Text style={emptyListStyles.addImagesButtonText}>
            Ajouter des images
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
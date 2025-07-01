import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input, Button } from "@/components/atoms";
import { theme } from "@/types/theme";

interface AddMemberSectionProps {
  newMemberEmail: string;
  isAddingMember: boolean;
  error: string | null;
  onEmailChange: (email: string) => void;
  onAddMember: () => void;
}

export const AddMemberSection: React.FC<AddMemberSectionProps> = ({
  newMemberEmail,
  isAddingMember,
  error,
  onEmailChange,
  onAddMember,
}) => {
  return (
    <View style={styles.addMemberSection}>
      <Text style={styles.sectionTitle}>Ajouter un membre</Text>
      <View style={styles.addMemberForm}>
        <Input
          placeholder="Email du nouveau membre"
          value={newMemberEmail}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.emailInput}
        />
        <Button
          title={isAddingMember ? "" : "Inviter"}
          onPress={onAddMember}
          disabled={!newMemberEmail.trim() || isAddingMember}
          size="small"
        >
          {isAddingMember && (
            <ActivityIndicator color={theme.colors.secondary} size="small" />
          )}
        </Button>
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle"
            size={16}
            color={theme.colors.error}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  addMemberSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  addMemberForm: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  emailInput: {
    flex: 1,
    marginBottom: 0,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
  },
});
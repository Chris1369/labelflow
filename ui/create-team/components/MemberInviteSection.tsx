import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/atoms';
import { theme } from '@/types/theme';

interface MemberInviteSectionProps {
  currentEmail: string;
  onEmailChange: (text: string) => void;
  onAddEmail: () => void;
}

export const MemberInviteSection: React.FC<MemberInviteSectionProps> = ({
  currentEmail,
  onEmailChange,
  onAddEmail,
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Inviter des membres</Text>
      <View style={styles.emailInputContainer}>
        <Input
          placeholder="Adresse email"
          value={currentEmail}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.emailInput}
        />
        <TouchableOpacity
          style={styles.addEmailButton}
          onPress={onAddEmail}
          disabled={!currentEmail.trim()}
        >
          <Ionicons
            name="add-circle"
            size={32}
            color={currentEmail.trim() ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  emailInput: {
    flex: 1,
    marginBottom: 0,
  },
  addEmailButton: {
    paddingTop: theme.spacing.md,
  },
});
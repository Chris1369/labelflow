import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

interface MemberItemProps {
  email: string;
  onRemove: () => void;
}

export const MemberItem: React.FC<MemberItemProps> = ({ email, onRemove }) => {
  return (
    <View style={styles.memberItem}>
      <Text style={styles.memberEmail}>{email}</Text>
      <TouchableOpacity
        onPress={onRemove}
        style={styles.removeMemberButton}
      >
        <Ionicons name="close-circle" size={24} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  memberEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  removeMemberButton: {
    padding: theme.spacing.xs,
  },
});
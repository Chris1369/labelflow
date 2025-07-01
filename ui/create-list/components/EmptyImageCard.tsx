import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

interface EmptyImageCardProps {
  isCreating: boolean;
  onPress: () => void;
}

export const EmptyImageCard: React.FC<EmptyImageCardProps> = ({ isCreating, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.firstImageCard}
      onPress={onPress}
      disabled={isCreating}
    >
      <Ionicons name="image-outline" size={48} color={theme.colors.primary} />
      <Text style={styles.firstImageTitle}>Ajouter des images</Text>
      <Text style={styles.firstImageHint}>
        Appuyez pour sélectionner vos premières images
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  firstImageCard: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
  },
  firstImageTitle: {
    ...theme.fonts.subtitle,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  firstImageHint: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
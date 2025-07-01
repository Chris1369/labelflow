import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';
import { ToggleItem } from './ToggleItem';
import { settingsActions } from '../actions';

interface PreferencesSectionProps {
  includePublicCategories: boolean;
  includePublicLabels: boolean;
  includePublicProjects: boolean;
  canBeAddedToTeam: boolean;
  setIncludePublicCategories: (value: boolean) => void;
  setIncludePublicLabels: (value: boolean) => void;
  setIncludePublicProjects: (value: boolean) => void;
}

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  includePublicCategories,
  includePublicLabels,
  includePublicProjects,
  canBeAddedToTeam,
  setIncludePublicCategories,
  setIncludePublicLabels,
  setIncludePublicProjects,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Préférences de visibilité</Text>

      <ToggleItem
        label="Récupérer les catégories publiques"
        description="Afficher les catégories créées par d'autres utilisateurs"
        value={includePublicCategories}
        onValueChange={setIncludePublicCategories}
      />

      <View style={styles.separator} />

      <ToggleItem
        label="Peut être ajouté à une équipe"
        description="Permettre à d'autres utilisateurs de vous ajouter à leur équipe"
        value={canBeAddedToTeam}
        onValueChange={(value) => settingsActions.updateCanBeAddedToTeam(value)}
      />

      <View style={styles.separator} />

      <ToggleItem
        label="Récupérer les labels publics"
        description="Afficher les labels créés par d'autres utilisateurs"
        value={includePublicLabels}
        onValueChange={setIncludePublicLabels}
      />

      <View style={styles.separator} />

      <ToggleItem
        label="Récupérer les projets publics"
        description="Afficher les projets créés par d'autres utilisateurs"
        value={includePublicProjects}
        onValueChange={setIncludePublicProjects}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { settingsActions } from '../actions';

interface ModelTrainingSectionProps {
  isTraining: boolean;
}

export const ModelTrainingSection: React.FC<ModelTrainingSectionProps> = ({ isTraining }) => {
  const handleStartTraining = () => {
    Alert.alert(
      "Démarrer l'entraînement",
      "Voulez-vous démarrer l'entraînement du modèle IA avec vos données annotées ?\n\nCela peut prendre plusieurs minutes.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Démarrer",
          onPress: () => settingsActions.startModelTraining()
        }
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Modèle IA</Text>
      
      <TouchableOpacity
        style={[styles.trainingButton, isTraining && styles.trainingButtonDisabled]}
        onPress={handleStartTraining}
        disabled={isTraining}
      >
        {isTraining ? (
          <>
            <ActivityIndicator size="small" color={theme.colors.secondary} style={styles.buttonIcon} />
            <Text style={styles.trainingButtonText}>Entraînement en cours...</Text>
          </>
        ) : (
          <>
            <Ionicons name="fitness" size={24} color={theme.colors.secondary} style={styles.buttonIcon} />
            <Text style={styles.trainingButtonText}>Démarrer l'entraînement</Text>
          </>
        )}
      </TouchableOpacity>
      
      <Text style={styles.trainingInfo}>
        Entraîne le modèle de détection avec toutes vos annotations.
        Epochs: 100, Batch size: 8, Mode: Hybride
      </Text>
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
  trainingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  trainingButtonDisabled: {
    opacity: 0.7,
  },
  trainingButtonText: {
    ...theme.fonts.button,
    color: theme.colors.secondary,
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  trainingInfo: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: theme.fontSize.sm * 1.4,
  },
});
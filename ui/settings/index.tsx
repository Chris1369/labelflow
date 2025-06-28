import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { useSettingsStore } from "./useStore";
import { settingsActions } from "./actions";
import { Ionicons } from "@expo/vector-icons";

export const SettingsScreen: React.FC = () => {
  const {
    includePublicCategories,
    includePublicLabels,
    includePublicProjects,
    canBeAddedToTeam,
    setIncludePublicCategories,
    setIncludePublicLabels,
    setIncludePublicProjects,
    setCanBeAddedToTeam,
  } = useSettingsStore();

  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    // Charger les paramètres utilisateur au montage
    settingsActions.loadUserSettings();
  }, []);

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
          onPress: () => settingsActions.startModelTraining(setIsTraining)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Paramètres</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences de visibilité</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                Récupérer les catégories publiques
              </Text>
              <Text style={styles.settingDescription}>
                Afficher les catégories créées par d'autres utilisateurs
              </Text>
            </View>
            <Switch
              value={includePublicCategories}
              onValueChange={setIncludePublicCategories}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + "80",
              }}
              thumbColor={
                includePublicCategories
                  ? theme.colors.primary
                  : theme.colors.backgroundSecondary
              }
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                Peut être ajouté à une équipe
              </Text>
              <Text style={styles.settingDescription}>
                Permettre à d'autres utilisateurs de vous ajouter à leur équipe
              </Text>
            </View>
            <Switch
              value={canBeAddedToTeam}
              onValueChange={(value) =>
                settingsActions.updateCanBeAddedToTeam(value)
              }
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + "80",
              }}
              thumbColor={
                canBeAddedToTeam
                  ? theme.colors.primary
                  : theme.colors.backgroundSecondary
              }
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                Récupérer les labels publics
              </Text>
              <Text style={styles.settingDescription}>
                Afficher les labels créés par d'autres utilisateurs
              </Text>
            </View>
            <Switch
              value={includePublicLabels}
              onValueChange={setIncludePublicLabels}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + "80",
              }}
              thumbColor={
                includePublicLabels
                  ? theme.colors.primary
                  : theme.colors.backgroundSecondary
              }
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                Récupérer les projets publics
              </Text>
              <Text style={styles.settingDescription}>
                Afficher les projets créés par d'autres utilisateurs
              </Text>
            </View>
            <Switch
              value={includePublicProjects}
              onValueChange={setIncludePublicProjects}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + "80",
              }}
              thumbColor={
                includePublicProjects
                  ? theme.colors.primary
                  : theme.colors.backgroundSecondary
              }
            />
          </View>
        </View>

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

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Ces paramètres sont stockés localement et s'appliquent uniquement à
            cet appareil.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
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
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.fontSize.sm * 1.4,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  infoSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.info + "10",
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xl,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.info,
    textAlign: "center",
    lineHeight: theme.fontSize.sm * 1.5,
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

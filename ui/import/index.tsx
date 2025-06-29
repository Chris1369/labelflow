import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { router } from 'expo-router';

interface ImportScreenProps {
  projectId: string;
}

export const ImportScreen: React.FC<ImportScreenProps> = ({ projectId }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Que souhaitez-vous faire ?</Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push(`/(project)/${projectId}/create-list`)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="add-circle"
                size={48}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.optionTitle}>Créer une liste</Text>
            <Text style={styles.optionDescription}>
              Importez des images pour créer une nouvelle liste non labelisée
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push(`/(project)/${projectId}/unlabeled-list`)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="pricetags"
                size={48}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.optionTitle}>Labeliser une liste</Text>
            <Text style={styles.optionDescription}>
              Ajouter des labels aux images non labelisées
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.fonts.title,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  optionsContainer: {
    gap: theme.spacing.md,
  },
  optionCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  optionTitle: {
    ...theme.fonts.subtitle,
    marginBottom: theme.spacing.sm,
  },
  optionDescription: {
    ...theme.fonts.caption,
    textAlign: 'center',
  },
});
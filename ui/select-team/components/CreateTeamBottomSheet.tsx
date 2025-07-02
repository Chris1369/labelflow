import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Input, Button } from '@/components/atoms';
import { SimpleBottomSheet } from '@/components/molecules';
import { theme } from '@/types/theme';
import { teamAPI } from '@/api/team.api';
import { useSelectTeamStore } from '../useStore';
import { router } from 'expo-router';

export interface CreateTeamBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const CreateTeamBottomSheet = forwardRef<CreateTeamBottomSheetRef>((_, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsVisible(true);
      setName('');
      setDescription('');
    },
    close: () => setIsVisible(false),
  }));

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour l\'équipe');
      return;
    }

    setIsCreating(true);
    try {
      const newTeam = await teamAPI.create({
        name: name.trim(),
        description: description.trim(),
      });

      // Refresh teams list
      useSelectTeamStore.getState().refreshTeams?.();

      // Reset form and close
      setName('');
      setDescription('');
      setIsVisible(false);

      Alert.alert('Succès', 'Équipe créée avec succès', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to the new team
            const teamId = newTeam._id || newTeam.id;
            router.push(`/(team)/${teamId}`);
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de créer l\'équipe');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <SimpleBottomSheet
      visible={isVisible}
      onClose={handleClose}
      height="60%"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Nouvelle équipe</Text>
          <Text style={styles.subtitle}>
            Créez une équipe pour collaborer sur vos projets
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Nom de l'équipe"
            value={name}
            onChangeText={setName}
            containerStyle={styles.input}
            autoFocus
          />

          <Input
            placeholder="Description (optionnel)"
            value={description}
            onChangeText={setDescription}
            containerStyle={styles.input}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            disabled={isCreating}
          >
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>

          <Button
            title={isCreating ? 'Création...' : 'Créer'}
            onPress={handleCreate}
            disabled={isCreating || !name.trim()}
            style={styles.createButton}
          />
        </View>
      </View>
    </SimpleBottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  title: {
    ...theme.fonts.subtitle,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    ...theme.fonts.button,
    color: theme.colors.textSecondary,
  },
  createButton: {
    flex: 1,
  },
});
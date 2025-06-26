import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Label } from '@/types/label';
import { theme } from '@/types/theme';
import { labelAPI } from '@/api/label.api';

interface LabelItemProps {
  label: Label;
  onDelete: () => void;
  onUpdate?: () => void;
}

export const LabelItem: React.FC<LabelItemProps> = ({ label, onDelete, onUpdate }) => {
  const [isPublic, setIsPublic] = useState(label.isPublic);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le label',
      `Êtes-vous sûr de vouloir supprimer "${label.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          onPress: onDelete,
          style: 'destructive'
        },
      ]
    );
  };

  const handleTogglePublic = async (value: boolean) => {
    try {
      setIsUpdating(true);
      setIsPublic(value);
      
      const labelId = label._id || label.id;
      await labelAPI.update(labelId, { isPublic: value });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating label visibility:', error);
      setIsPublic(!value);
      Alert.alert(
        'Erreur',
        'Impossible de modifier la visibilité du label'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.labelInfo}>
          <View style={styles.labelIcon}>
            <Ionicons name="pricetag" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.labelName}>{label.name}</Text>
        </View>
        <View style={styles.actions}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{isPublic ? 'Public' : 'Privé'}</Text>
            <Switch
              value={isPublic}
              onValueChange={handleTogglePublic}
              disabled={isUpdating}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={isPublic ? theme.colors.secondary : theme.colors.backgroundSecondary}
              ios_backgroundColor={theme.colors.border}
            />
          </View>
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  labelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  labelIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  labelName: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  switchLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '@/types/category';
import { Label } from '@/types/label';
import { theme } from '@/types/theme';
import { AddLabelsModal } from './AddLabelsModal';

interface CategoryItemProps {
  category: Category;
  labels: Label[];
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onLabelsUpdated?: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  labels,
  isExpanded,
  onToggle,
  onDelete,
  onLabelsUpdated,
}) => {
  const [isAddLabelsModalVisible, setIsAddLabelsModalVisible] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la catégorie',
      `Êtes-vous sûr de vouloir supprimer "${category.name}" ?`,
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Ionicons
            name={isExpanded ? 'chevron-down' : 'chevron-forward'}
            size={20}
            color={theme.colors.textSecondary}
          />
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.labelCount}>
              {category.labels?.length || 0} labels
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {category.isPublic && (
            <View style={styles.publicBadge}>
              <Text style={styles.publicText}>Public</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.labelsContainer}>
            {labels && labels.length > 0 ? (
              labels.map((label) => (
                <View key={label.id} style={styles.labelChip}>
                  <Text style={styles.labelText}>{label.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aucun label dans cette catégorie</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.addLabelButton}
            onPress={() => setIsAddLabelsModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.addLabelText}>Ajouter des labels</Text>
          </TouchableOpacity>
        </View>
      )}

      <AddLabelsModal
        isVisible={isAddLabelsModalVisible}
        onClose={() => setIsAddLabelsModalVisible(false)}
        category={category}
        onLabelsUpdated={() => {
          onLabelsUpdated?.();
          onToggle();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryInfo: {
    marginLeft: theme.spacing.sm,
  },
  categoryName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  labelCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  publicBadge: {
    backgroundColor: theme.colors.info + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  publicText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.info,
    fontWeight: '600',
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  expandedContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  addLabelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
    borderStyle: 'dashed',
  },
  addLabelText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  labelChip: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  labelText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});
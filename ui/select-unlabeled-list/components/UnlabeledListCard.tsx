import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

export interface UnlabeledListItem {
  id?: string;
  _id?: string;
  name: string;
  items?: any[];
  createdAt?: string;
}

interface UnlabeledListCardProps {
  item: UnlabeledListItem;
  onPress: (item: UnlabeledListItem) => void;
}

export const UnlabeledListCard: React.FC<UnlabeledListCardProps> = ({
  item,
  onPress,
}) => {
  const itemCount = item.items?.length || 0;
  
  return (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.listHeader}>
        <View style={styles.listInfo}>
          <Text style={styles.listName}>{item.name}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.countBadge}>
              <Ionicons name="images-outline" size={14} color={theme.colors.primary} />
              <Text style={styles.countText}>{itemCount} image{itemCount !== 1 ? 's' : ''}</Text>
            </View>
            {item.createdAt && (
              <Text style={styles.dateText}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={theme.colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  listInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  listName: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  countText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
  },
  dateText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
  },
});
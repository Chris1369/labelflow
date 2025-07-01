import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { ProjectItem } from '@/types/project';

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - theme.spacing.lg * 3) / 2;

interface ItemCardProps {
  item: ProjectItem;
  isOwner: boolean;
  isDeletingItem: boolean;
  onDelete: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isOwner,
  isDeletingItem,
  onDelete,
}) => {
  return (
    <TouchableOpacity style={styles.itemCard} activeOpacity={0.9}>
      {isOwner && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          disabled={isDeletingItem}
        >
          {isDeletingItem ? (
            <ActivityIndicator size='small' color={theme.colors.secondary} />
          ) : (
            <Ionicons
              name='trash-outline'
              size={20}
              color={theme.colors.secondary}
            />
          )}
        </TouchableOpacity>
      )}
      <Image
        source={{ uri: item.thumbnailUrl || item.fileUrl }}
        style={styles.itemImage}
        resizeMode='cover'
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemLabel} numberOfLines={1}>
          {item.labels.map((label) => label.name).join(", ")}
        </Text>
        {item.labels && item.labels.length > 0 && (
          <Text style={styles.itemPositionCount}>
            {item.labels.length} label
            {item.labels.length > 1 ? "s" : ""}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    width: ITEM_SIZE,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.sm,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: "100%",
    height: ITEM_SIZE,
    backgroundColor: theme.colors.backgroundTertiary,
  },
  itemInfo: {
    padding: theme.spacing.sm,
  },
  itemLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  itemPositionCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
});
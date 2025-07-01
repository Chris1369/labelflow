import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { theme } from '@/types/theme';
import { ProjectItem } from '@/types/project';
import { ItemCard } from './ItemCard';
import { EmptyItemsState } from './EmptyItemsState';
import { FooterLoader } from './FooterLoader';

interface ItemsListProps {
  items: ProjectItem[];
  isOwner: boolean;
  isLoading: boolean;
  hasMore: boolean;
  deletingItemId: string | null;
  onLoadMore: () => void;
  onRefresh: () => void;
  onDeleteItem: (id: string, objectItemTrainingId?: string) => void;
}

export const ItemsList: React.FC<ItemsListProps> = ({
  items,
  isOwner,
  isLoading,
  hasMore,
  deletingItemId,
  onLoadMore,
  onRefresh,
  onDeleteItem,
}) => {
  const handleDeleteItem = (item: ProjectItem) => {
    Alert.alert(
      "Supprimer l'item",
      "Êtes-vous sûr de vouloir supprimer cet item ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => onDeleteItem(item.id, item.objectItemTrainingId),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ProjectItem }) => (
    <ItemCard
      item={item}
      isOwner={isOwner}
      isDeletingItem={deletingItemId === item.id}
      onDelete={() => handleDeleteItem(item)}
    />
  );

  const renderEmptyState = () => {
    if (isLoading) return null;
    return <EmptyItemsState />;
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.columnWrapper}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={renderEmptyState}
      ListFooterComponent={() => <FooterLoader hasMore={hasMore} />}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshing={isLoading && items.length > 0}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  separator: {
    height: theme.spacing.md,
  },
});
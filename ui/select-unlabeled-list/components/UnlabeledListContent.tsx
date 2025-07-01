import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';
import { UnlabeledListItem, UnlabeledListCard } from './UnlabeledListCard';
import { EmptyListState } from './EmptyListState';

interface UnlabeledListContentProps {
  lists: UnlabeledListItem[];
  searchQuery: string;
  onListSelect: (item: UnlabeledListItem) => void;
  onCreateList: () => void;
}

export const UnlabeledListContent: React.FC<UnlabeledListContentProps> = ({
  lists,
  searchQuery,
  onListSelect,
  onCreateList,
}) => {
  return (
    <FlatList
      data={lists}
      keyExtractor={(item) => item.id || item._id || ''}
      renderItem={({ item }) => (
        <UnlabeledListCard item={item} onPress={onListSelect} />
      )}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <EmptyListState 
          searchQuery={searchQuery} 
          onCreateList={onCreateList} 
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  separator: {
    height: theme.spacing.md,
  },
});
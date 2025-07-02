import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderPage } from "@/components/atoms";
import { theme } from "@/types/theme";
import { useViewItemsStore } from "./useStore";
import { ViewItemsScreenProps } from "./types";
import {
  LoadingItemsState,
  ErrorItemsState,
  ItemsList,
} from "./components";

export const ViewItemsScreen: React.FC<ViewItemsScreenProps> = ({
  projectId,
}) => {
  const {
    items,
    isLoading,
    error,
    hasMore,
    isOwner,
    deletingItemId,
    setProjectId,
    loadItems,
    loadMoreItems,
    deleteItem,
    reset,
  } = useViewItemsStore();

  useEffect(() => {
    setProjectId(projectId);
    loadItems(true);

    return () => {
      reset();
    };
  }, [projectId]);


  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <HeaderPage 
          title="Items" 
          subtitle="Chargement..."
        />
        <LoadingItemsState />
      </SafeAreaView>
    );
  }

  if (error && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <HeaderPage 
          title="Items" 
          subtitle="Erreur"
        />
        <ErrorItemsState 
          error={error} 
          onRetry={() => loadItems(true)} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage 
        title="Items du projet" 
        subtitle={`${items.length} items labellisés`}
      />
      
      <ItemsList
        items={items}
        isOwner={isOwner}
        isLoading={isLoading}
        hasMore={hasMore}
        deletingItemId={deletingItemId}
        onLoadMore={loadMoreItems}
        onRefresh={() => loadItems(true)}
        onDeleteItem={deleteItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { useStore } from "./useStore";
import { actions } from "./actions";
import { router, useFocusEffect } from "expo-router";
import {
  LoadingListState,
  ErrorListState,
  UnlabeledListContent,
  type UnlabeledListItem,
  ListActionBottomSheet,
  type ListActionBottomSheetRef,
} from "./components";
import { HeaderPage, Input } from "@/components/atoms";
import { useUnlabeledListsByProject } from "@/hooks/queries";

interface SelectUnlabeledListScreenProps {
  projectId: string;
}

export const SelectUnlabeledListScreen: React.FC<
  SelectUnlabeledListScreenProps
> = ({ projectId }) => {
  const { searchQuery } = useStore();
  const listActionBottomSheetRef = useRef<ListActionBottomSheetRef>(null);

  const {
    data: filteredLists,
    isLoading,
    refetch,
    error,
  } = useUnlabeledListsByProject(projectId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleListSelect = (list: UnlabeledListItem) => {
    listActionBottomSheetRef.current?.open(list);
  };

  const handleLabelImages = (list: UnlabeledListItem) => {
    const listId = list.id || list._id;
    if (listId) {
      router.push(`/(project)/${projectId}/label-list?listId=${listId}`);
    }
  };

  const handleAddImages = (list: UnlabeledListItem) => {
    const listId = list.id || list._id;
    if (listId) {
      router.push(`/(project)/${projectId}/create-list?mode=add&listId=${listId}`);
    }
  };

  const handleCreateList = () => {
    router.push(`/(project)/${projectId}/create-list`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage
        title="Listes à labelliser"
        subtitle="Sélectionnez une liste d'images à labelliser"
        rightAction={{
          icon: 'add-circle-outline',
          onPress: handleCreateList,
        }}
      />
      <View style={styles.content}>
        <Input
          placeholder="Rechercher une liste..."
          value={searchQuery}
          onChangeText={actions.setSearchQuery}
          icon="search"
          containerStyle={styles.searchInput}
        />
        {isLoading ? (
        <LoadingListState />
      ) : error ? (
        <ErrorListState error={error.message} onRetry={() => refetch()} />
      ) : (
        <>
          <UnlabeledListContent
            lists={filteredLists || []}
            searchQuery={searchQuery}
            onListSelect={handleListSelect}
            onCreateList={handleCreateList}
          />
        </>
      )}
      </View>
      
      <ListActionBottomSheet
        ref={listActionBottomSheetRef}
        onLabelImages={handleLabelImages}
        onAddImages={handleAddImages}
      />
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
  },
  searchInput: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/types/theme';
import { useStore } from './useStore';
import { actions } from './actions';
import { router } from 'expo-router';
import {
  ListHeader,
  LoadingListState,
  ErrorListState,
  UnlabeledListContent,
  FloatingCreateButton,
  type UnlabeledListItem,
} from './components';

interface SelectUnlabeledListScreenProps {
  projectId: string;
}

export const SelectUnlabeledListScreen: React.FC<SelectUnlabeledListScreenProps> = ({ projectId }) => {
  const { 
    lists, 
    filteredLists, 
    searchQuery, 
    isLoading, 
    error 
  } = useStore();

  useEffect(() => {
    actions.loadLists(projectId);
  }, [projectId]);

  const handleListSelect = (list: UnlabeledListItem) => {
    const listId = list.id || list._id;
    if (listId) {
      router.push(`/(project)/${projectId}/label-list?listId=${listId}`);
    }
  };

  const handleCreateList = () => {
    router.push(`/(project)/${projectId}/create-list`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ListHeader
        searchQuery={searchQuery}
        onSearchChange={actions.setSearchQuery}
      />

      {isLoading ? (
        <LoadingListState />
      ) : error ? (
        <ErrorListState 
          error={error} 
          onRetry={() => actions.loadLists(projectId)} 
        />
      ) : (
        <>
          <UnlabeledListContent
            lists={filteredLists}
            searchQuery={searchQuery}
            onListSelect={handleListSelect}
            onCreateList={handleCreateList}
          />
          <FloatingCreateButton onPress={handleCreateList} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
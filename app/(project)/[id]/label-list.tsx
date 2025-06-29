import React from 'react';
import { AddItemsScreen } from '@/ui/add-items';
import { useLocalSearchParams } from 'expo-router';

export default function LabelListPage() {
  const { id, listId } = useLocalSearchParams<{ id: string; listId?: string }>();
  
  return <AddItemsScreen projectId={id} isForUnlabeled={true} unlabeledListId={listId} />;
}
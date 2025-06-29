import React from 'react';
import { LabelListScreen } from '@/ui/label-list';
import { useLocalSearchParams } from 'expo-router';

export default function LabelListPage() {
  const { id, listId } = useLocalSearchParams<{ id: string; listId?: string }>();
  
  return <LabelListScreen projectId={id} listId={listId} />;
}
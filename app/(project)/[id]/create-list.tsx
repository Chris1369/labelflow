import React from 'react';
import { CreateListScreen } from '@/ui/create-list';
import { useLocalSearchParams } from 'expo-router';

export default function CreateListPage() {
  const { id, mode, listId } = useLocalSearchParams<{ 
    id: string; 
    mode?: 'create' | 'add';
    listId?: string;
  }>();
  
  return <CreateListScreen 
    projectId={id} 
    mode={mode as 'create' | 'add' || 'create'}
    listId={listId}
  />;
}
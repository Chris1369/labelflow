import React from 'react';
import { CreateListScreen } from '@/ui/create-list';
import { useLocalSearchParams } from 'expo-router';

export default function CreateListPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return <CreateListScreen projectId={id} />;
}
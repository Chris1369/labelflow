import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ViewItemsScreen } from '@/ui/view-items';

export default function ViewItemsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  if (!id) {
    return null;
  }

  return <ViewItemsScreen projectId={id} />;
}
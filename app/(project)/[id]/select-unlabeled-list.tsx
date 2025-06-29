import React from 'react';
import { SelectUnlabeledListScreen } from '@/ui/select-unlabeled-list';
import { useLocalSearchParams } from 'expo-router';

export default function SelectUnlabeledListPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return <SelectUnlabeledListScreen projectId={id} />;
}
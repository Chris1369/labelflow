import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ImportScreen } from '../../../ui/import';

export default function ImportPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return <ImportScreen projectId={id || ''} />;
}
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TeamScreen } from '../../ui/team';

export default function TeamPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return <TeamScreen teamId={id || ''} />;
}
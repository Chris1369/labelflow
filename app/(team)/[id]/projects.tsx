import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TeamProjectsScreen } from '../../../ui/team-projects';

export default function TeamProjectsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return <TeamProjectsScreen teamId={id || ''} />;
}
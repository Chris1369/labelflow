import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TeamMembersScreen } from '../../../ui/team-members';

export default function TeamMembersPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return <TeamMembersScreen teamId={id || ''} />;
}
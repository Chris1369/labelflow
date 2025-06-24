import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ProjectScreen } from '../../ui/project';

export default function ProjectPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return <ProjectScreen projectId={id || ''} />;
}
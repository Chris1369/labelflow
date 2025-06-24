import { router } from 'expo-router';
import { useSelectProjectStore } from './useStore';
import { Project } from '../../types/project';

export const selectProjectActions = {
  handleSearchChange: (query: string) => {
    useSelectProjectStore.getState().setSearchQuery(query);
  },

  handleProjectSelect: (project: Project) => {
    useSelectProjectStore.getState().selectProject(project);
    router.push({
      pathname: '/(project)/[id]',
      params: { id: project.id, name: project.name }
    });
  },

  loadProjects: () => {
    useSelectProjectStore.getState().loadProjects();
  },
};
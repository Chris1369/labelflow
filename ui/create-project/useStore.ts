import { create } from 'zustand';
import { projectAPI } from '@/api/project.api';
import { router } from 'expo-router';

interface CreateProjectState {
  name: string;
  description: string;
  isCreating: boolean;
  error: string | null;
}

interface CreateProjectActions {
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setIsCreating: (isCreating: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
  createProject: () => Promise<void>;
}

export const useCreateProjectStore = create<CreateProjectState & CreateProjectActions>((set, get) => ({
  name: '',
  description: '',
  isCreating: false,
  error: null,

  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setError: (error) => set({ error }),
  
  resetForm: () => set({
    name: '',
    description: '',
    isCreating: false,
    error: null,
  }),
  
  createProject: async () => {
    const { name, description } = get();
    
    if (!name.trim() || !description.trim()) {
      set({ error: 'Veuillez remplir tous les champs' });
      return;
    }
    
    set({ isCreating: true, error: null });
    
    try {
      const project = await projectAPI.create({
        name: name.trim(),
        description: description.trim(),
      });
      
      // Réinitialiser le formulaire
      get().resetForm();
      
      // Naviguer vers le projet créé
      router.push(`/(project)/${project.id}`);
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la création du projet',
        isCreating: false 
      });
    }
  },
}));
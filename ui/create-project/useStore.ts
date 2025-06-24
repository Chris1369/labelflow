import { create } from 'zustand';

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
}));
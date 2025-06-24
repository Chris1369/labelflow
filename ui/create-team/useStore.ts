import { create } from 'zustand';

interface TeamMember {
  email: string;
  id: string;
}

interface CreateTeamState {
  name: string;
  description: string;
  invitedMembers: TeamMember[];
  currentEmail: string;
  isCreating: boolean;
  error: string | null;
}

interface CreateTeamActions {
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setCurrentEmail: (email: string) => void;
  addMember: () => void;
  removeMember: (id: string) => void;
  setIsCreating: (isCreating: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

export const useCreateTeamStore = create<CreateTeamState & CreateTeamActions>((set, get) => ({
  name: '',
  description: '',
  invitedMembers: [],
  currentEmail: '',
  isCreating: false,
  error: null,

  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setCurrentEmail: (currentEmail) => set({ currentEmail }),
  
  addMember: () => {
    const { currentEmail, invitedMembers } = get();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(currentEmail)) {
      set({ error: 'Email invalide' });
      return;
    }
    
    if (invitedMembers.some(member => member.email === currentEmail)) {
      set({ error: 'Cet email est déjà dans la liste' });
      return;
    }
    
    const newMember = {
      email: currentEmail,
      id: Date.now().toString(),
    };
    
    set({
      invitedMembers: [...invitedMembers, newMember],
      currentEmail: '',
      error: null,
    });
  },
  
  removeMember: (id) => {
    set((state) => ({
      invitedMembers: state.invitedMembers.filter(member => member.id !== id),
    }));
  },
  
  setIsCreating: (isCreating) => set({ isCreating }),
  setError: (error) => set({ error }),
  
  resetForm: () => set({
    name: '',
    description: '',
    invitedMembers: [],
    currentEmail: '',
    isCreating: false,
    error: null,
  }),
}));
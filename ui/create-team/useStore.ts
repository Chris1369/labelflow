import { create } from 'zustand';
import { teamAPI } from '@/api/team.api';
import { router } from 'expo-router';

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
  createTeam: () => Promise<void>;
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
  
  createTeam: async () => {
    const { name, description, invitedMembers } = get();
    
    if (!name.trim() || !description.trim()) {
      set({ error: 'Veuillez remplir tous les champs' });
      return;
    }
    
    set({ isCreating: true, error: null });
    
    try {
      // Créer la team
      const team = await teamAPI.create({
        name: name.trim(),
        description: description.trim(),
      });
      
      // Si des membres ont été invités, envoyer les invitations
      if (invitedMembers.length > 0) {
        const emails = invitedMembers.map(member => member.email);
        await teamAPI.inviteMembers(team.id, emails);
      }
      
      // Réinitialiser le formulaire
      get().resetForm();
      
      // Naviguer vers la team créée
      router.push(`/(team)/${team.id}`);
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la création de l\'équipe',
        isCreating: false 
      });
    }
  },
}));
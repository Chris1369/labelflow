import { create } from 'zustand';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

interface TeamMembersState {
  members: TeamMember[];
  filteredMembers: TeamMember[];
  searchQuery: string;
  newMemberEmail: string;
  isAddingMember: boolean;
  error: string | null;
}

interface TeamMembersActions {
  setMembers: (members: TeamMember[]) => void;
  setSearchQuery: (query: string) => void;
  setNewMemberEmail: (email: string) => void;
  setIsAddingMember: (isAdding: boolean) => void;
  setError: (error: string | null) => void;
  filterMembers: () => void;
  addMember: () => void;
  removeMember: (id: string) => void;
  resetForm: () => void;
}

export const useTeamMembersStore = create<TeamMembersState & TeamMembersActions>((set, get) => ({
  members: [],
  filteredMembers: [],
  searchQuery: '',
  newMemberEmail: '',
  isAddingMember: false,
  error: null,

  setMembers: (members) => {
    set({ members, filteredMembers: members });
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().filterMembers();
  },

  setNewMemberEmail: (email) => set({ newMemberEmail: email, error: null }),
  setIsAddingMember: (isAddingMember) => set({ isAddingMember }),
  setError: (error) => set({ error }),

  filterMembers: () => {
    const { members, searchQuery } = get();
    if (!searchQuery.trim()) {
      set({ filteredMembers: members });
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = members.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
    );
    set({ filteredMembers: filtered });
  },

  addMember: async () => {
    const { newMemberEmail, members } = get();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(newMemberEmail)) {
      set({ error: 'Email invalide' });
      return;
    }
    
    if (members.some(member => member.email === newMemberEmail)) {
      set({ error: 'Ce membre fait déjà partie de l\'équipe' });
      return;
    }

    try {
      set({ isAddingMember: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail,
        role: 'member',
        joinedAt: new Date().toISOString(),
      };
      
      const updatedMembers = [...members, newMember];
      set({ 
        members: updatedMembers,
        filteredMembers: updatedMembers,
        newMemberEmail: '',
      });
    } catch (error) {
      set({ error: 'Erreur lors de l\'ajout du membre' });
    } finally {
      set({ isAddingMember: false });
    }
  },

  removeMember: (id) => {
    const updatedMembers = get().members.filter(member => member.id !== id);
    set({ 
      members: updatedMembers,
      filteredMembers: updatedMembers,
    });
  },

  resetForm: () => set({
    newMemberEmail: '',
    error: null,
  }),
}));
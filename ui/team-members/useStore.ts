import { TeamMember } from "@/types/team";
import { create } from "zustand";

interface TeamMembersState {
  teamId: string;
  members: TeamMember[];
  filteredMembers: TeamMember[];
  searchQuery: string;
  newMemberEmail: string;
  isAddingMember: boolean;
  error: string | null;
}

interface TeamMembersActions {
  setTeamId: (teamId: string) => void;
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

export const useTeamMembersStore = create<
  TeamMembersState & TeamMembersActions
>((set, get) => ({
  teamId: "",
  members: [],
  filteredMembers: [],
  searchQuery: "",
  newMemberEmail: "",
  isAddingMember: false,
  error: null,

  setTeamId: (teamId) => set({ teamId }),

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
        member?.username?.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
    );
    set({ filteredMembers: filtered });
  },

  addMember: () => {
    // Cette méthode est maintenant gérée dans actions.ts
  },

  removeMember: (id) => {
    const updatedMembers = get().members.filter((member) => member.id !== id);
    set({
      members: updatedMembers,
      filteredMembers: updatedMembers,
    });
  },

  resetForm: () =>
    set({
      newMemberEmail: "",
      error: null,
    }),
}));

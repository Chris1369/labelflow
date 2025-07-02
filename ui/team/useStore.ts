import { create } from 'zustand';
import { Team } from '@/types/team';
import { teamAPI } from '@/api/team.api';

interface TeamState {
  currentTeam: Team | null;
  isLoading: boolean;
  error: string | null;
}

interface TeamActions {
  setCurrentTeam: (team: Team | null) => void;
}

export const useTeamStore = create<TeamState & TeamActions>((set, get) => ({
  currentTeam: null,
  isLoading: false,
  error: null,

  setCurrentTeam: (team) => set({ currentTeam: team }),

}));
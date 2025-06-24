import { create } from 'zustand';
import { Team } from '../../mock/teams';

interface TeamState {
  currentTeam: Team | null;
}

interface TeamActions {
  setCurrentTeam: (team: Team | null) => void;
}

export const useTeamStore = create<TeamState & TeamActions>((set, get) => ({
  currentTeam: null,

  setCurrentTeam: (team) => set({ currentTeam: team }),
}));
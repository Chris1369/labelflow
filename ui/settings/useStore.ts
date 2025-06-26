import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsState {
  includePublicCategories: boolean;
  includePublicLabels: boolean;
  includePublicProjects: boolean;
  canBeAddedToTeam: boolean;
}

interface SettingsActions {
  setIncludePublicCategories: (value: boolean) => void;
  setIncludePublicLabels: (value: boolean) => void;
  setIncludePublicProjects: (value: boolean) => void;
  setCanBeAddedToTeam: (value: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings: SettingsState = {
  includePublicCategories: false,
  includePublicLabels: false,
  includePublicProjects: false,
  canBeAddedToTeam: false,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      // state
      ...defaultSettings,

      // actions
      setIncludePublicCategories: (value) =>
        set({ includePublicCategories: value }),
      setIncludePublicLabels: (value) => set({ includePublicLabels: value }),
      setIncludePublicProjects: (value) =>
        set({ includePublicProjects: value }),
      setCanBeAddedToTeam: (value) => set({ canBeAddedToTeam: value }),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: "bboxly-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

import { create } from 'zustand'

interface AppStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activePersonaFilter: string | null;
  setPersonaFilter: (id: string | null) => void;
  activePriorityFilter: string[];
  setPriorityFilter: (priorities: string[]) => void;
  activeReleaseFilter: number | null;
  setReleaseFilter: (release: number | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  activePersonaFilter: null,
  setPersonaFilter: (id) => set({ activePersonaFilter: id }),
  activePriorityFilter: [],
  setPriorityFilter: (priorities) => set({ activePriorityFilter: priorities }),
  activeReleaseFilter: null,
  setReleaseFilter: (release) => set({ activeReleaseFilter: release }),
}))

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, Mode } from '@/types'

function systemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

interface AppStore {
  theme: Theme
  mode: Mode
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  setMode: (m: Mode) => void
  toggleMode: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: systemTheme(),
      mode: 'einfach',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((s) => ({ mode: s.mode === 'einfach' ? 'erweitert' : 'einfach' })),
    }),
    { name: 'cineticket-ui', partialize: (s) => ({ theme: s.theme, mode: s.mode }) },
  ),
)

export const useMode = () => useAppStore((s) => s.mode)

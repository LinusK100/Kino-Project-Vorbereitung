import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, Mode } from '@/types'

function systemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

// ── Präsentations-Lauf ──
// scope 'gesamt' spielt das Drehbuch (gesamt.json) über alle Abschnitte;
// scope 'abschnitt' nur die Tour eines Abschnitts. index zählt Folien im Deck.
export interface PresRun {
  scope: 'gesamt' | 'abschnitt'
  section: string          // bei 'abschnitt': der Abschnitts-Schlüssel; bei 'gesamt' leer
  index: number
}

interface AppStore {
  theme: Theme
  mode: Mode
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  setMode: (m: Mode) => void
  toggleMode: () => void
  // Präsentation: öffnet laut Vorgabe immer hell; Dunkel per Knopf im Kopf.
  pres: PresRun | null
  presTheme: Theme
  presResume: number | null   // gemerkte Gesamt-Folie fürs „Ab hier weitermachen"
  startPres: (run: Omit<PresRun, 'index'> & { index?: number }) => void
  closePres: (resumeAt: number | null) => void
  setPresIndex: (i: number) => void
  togglePresTheme: () => void
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
      pres: null,
      presTheme: 'light',
      presResume: null,
      startPres: ({ scope, section, index = 0 }) =>
        set({ pres: { scope, section, index }, presTheme: 'light' }),
      closePres: (resumeAt) =>
        set((s) => ({ pres: null, presResume: s.pres?.scope === 'gesamt' ? resumeAt : s.presResume })),
      setPresIndex: (index) => set((s) => (s.pres ? { pres: { ...s.pres, index } } : {})),
      togglePresTheme: () => set((s) => ({ presTheme: s.presTheme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'cineticket-ui',
      partialize: (s) => ({ theme: s.theme, mode: s.mode, presResume: s.presResume }),
    },
  ),
)

export const useMode = () => useAppStore((s) => s.mode)

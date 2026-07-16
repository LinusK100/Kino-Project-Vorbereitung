// Bausteine für Folien-Visuals: theme-abhängige Farben (die Präsentation öffnet
// hell, dunkel per Knopf) und Animations-Presets zum gestaffelten Aufbau nach
// dem Folienwechsel. Alle Visuals rendern ausschließlich Inhalte aus src/data.
import { useAppStore } from '@/store/appStore'

export const VEASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── Neutrale Folien-Farben, je Präsentations-Theme ──
// Die Folie wird beim Theme-Wechsel neu gemountet (key im CinemaMode), daher
// dürfen die Werte hier zur Renderzeit gelesen werden — auch in SVG-Attributen,
// wo CSS-Variablen nicht funktionieren.
export interface PresPalette {
  fg: string; fgSoft: string; fgFaint: string
  line: string; lineStrong: string
  chip: string; chipStrong: string
  stroke: string; strokeSoft: string
  grid: string; halo: string
  badge: string; shadow: string
}

const NEUTRAL: Record<'dark' | 'light', PresPalette> = {
  dark: {
    fg: 'rgba(255,255,255,0.92)',       // Haupttext, Kartentitel
    fgSoft: 'rgba(255,255,255,0.62)',   // Sekundärtext
    fgFaint: 'rgba(255,255,255,0.45)',  // Labels, Nebensätze
    line: 'rgba(255,255,255,0.15)',     // Karten-/Chip-Rahmen
    lineStrong: 'rgba(255,255,255,0.3)',// Achsen, gestrichelte Rahmen
    chip: 'rgba(255,255,255,0.05)',     // Flächen
    chipStrong: 'rgba(255,255,255,0.1)',
    stroke: 'rgba(255,255,255,0.8)',    // SVG-Kanten und Pfeile
    strokeSoft: 'rgba(255,255,255,0.55)',
    grid: 'rgba(255,255,255,0.07)',     // Diagramm-Gitter
    halo: '#000',                       // paintOrder-Halo hinter SVG-Labels
    badge: 'rgba(0,0,0,0.35)',          // Zähler-Plakette auf farbigen Bändern
    shadow: '0 2px 14px rgba(0,0,0,0.5)',
  },
  light: {
    fg: '#122036',                      // dunkles Navy — Anlehnung an die PPT-Vorlage
    fgSoft: 'rgba(18,32,54,0.68)',
    fgFaint: 'rgba(18,32,54,0.48)',
    line: '#dee5f0',
    lineStrong: '#9fadc4',
    chip: '#f3f6fb',
    chipStrong: '#e7ecf5',
    stroke: 'rgba(18,32,54,0.78)',
    strokeSoft: 'rgba(18,32,54,0.55)',
    grid: 'rgba(18,32,54,0.08)',
    halo: '#fff',
    badge: 'rgba(255,255,255,0.72)',
    shadow: '0 2px 14px rgba(18,32,54,0.12)',
  },
}

export const pres = (): PresPalette => NEUTRAL[useAppStore.getState().presTheme]

// Die Status-/Gruppen-/Persona-Farben der Website sind auf helle Flächen
// abgestimmt; auf Schwarz braucht Text eine hellere Variante derselben Farbe.
// Hell liefert bright() deshalb die Originalfarbe zurück.
const BRIGHT: Record<string, string> = {
  '#437a22': '#94d95c', '#d19900': '#ffce56', '#a13544': '#ff8a99',
  '#006494': '#63c1f5', '#7a39bb': '#c894f5', '#64748b': '#a5b4c8',
  '#1f2937': '#9ca3af', '#01696f': '#4fd4c7', '#964219': '#f5a068',
  '#4f46e5': '#a5b4fc', '#475569': '#cbd5e1', '#2d6a8c': '#7cc0e8',
  '#8c5a2b': '#dcaa6e', '#c2410c': '#ff9466', '#e11d76': '#fb87bd',
  '#0891b2': '#4dd6f0', '#ef4444': '#ff9a9a', '#f59e0b': '#ffc861',
  '#22c55e': '#7ce6a3',
}
export const bright = (hex: string) =>
  useAppStore.getState().presTheme === 'light' ? hex : (BRIGHT[hex.toLowerCase()] ?? hex)

// Ein Element erscheint (Karten, Chips, Knoten) — i staffelt die Reihenfolge.
// Delays bewusst knapp: der Aufbau soll führen, nicht warten lassen.
export function pop(i: number, reduce: boolean | null, base = 0.2) {
  return reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 } }
    : {
        initial: { opacity: 0, y: 12, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { delay: base + i * 0.07, duration: 0.38, ease: VEASE },
      }
}

// Eine SVG-Linie/-Kante zeichnet sich (Pfeile in Diagramm-Ausschnitten).
export function draw(i: number, reduce: boolean | null, base = 0.3) {
  return reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 } }
    : {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
        transition: { delay: base + i * 0.11, duration: 0.32, ease: 'easeOut' as const },
      }
}

// Beschriftungen/Pfeilspitzen blenden nach der zugehörigen Kante ein.
export function fadeIn(i: number, reduce: boolean | null, base = 0.3, extra = 0.14) {
  return reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: base + i * 0.11 + extra, duration: 0.22 },
      }
}

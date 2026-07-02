// Bausteine für Kino-Folien-Visuals: helle Farbvarianten für den schwarzen
// Hintergrund und Animations-Presets zum gestaffelten Aufbau nach dem
// Folienwechsel. Alle Visuals rendern ausschließlich Inhalte aus src/data.

export const VEASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// Die Status-/Gruppen-/Persona-Farben der Website sind auf helle Flächen
// abgestimmt; auf Schwarz braucht Text eine hellere Variante derselben Farbe.
const BRIGHT: Record<string, string> = {
  '#437a22': '#94d95c', '#d19900': '#ffce56', '#a13544': '#ff8a99',
  '#006494': '#63c1f5', '#7a39bb': '#c894f5', '#64748b': '#a5b4c8',
  '#1f2937': '#9ca3af', '#01696f': '#4fd4c7', '#964219': '#f5a068',
  '#4f46e5': '#a5b4fc', '#475569': '#cbd5e1', '#2d6a8c': '#7cc0e8',
  '#8c5a2b': '#dcaa6e', '#c2410c': '#ff9466', '#e11d76': '#fb87bd',
  '#0891b2': '#4dd6f0', '#ef4444': '#ff9a9a', '#f59e0b': '#ffc861',
  '#22c55e': '#7ce6a3',
}
export const bright = (hex: string) => BRIGHT[hex.toLowerCase()] ?? hex

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

// Binding status palette — used consistently across sequence, state,
// class diagrams and the prototype (see docs/ARCHITECTURE.md).

export const STATUS_COLORS: Record<string, string> = {
  // green – available / valid / success
  FREI: '#437a22', GÜLTIG: '#437a22', ERFOLGREICH: '#437a22',
  // amber – temporary / pending / hold
  RESERVIERT: '#d19900', AUSSTEHEND: '#d19900', AUSGEWÄHLT: '#7a39bb',
  // red – blocked / cancelled / failed
  BELEGT: '#a13544', STORNIERT: '#a13544', FEHLGESCHLAGEN: '#a13544',
  // blue – completed
  EINGELÖST: '#006494', BESTÄTIGT: '#006494',
  // violet – refunded
  ERSTATTET: '#7a39bb',
  // grey – defective / expired / neutral
  DEFEKT: '#64748b', ABGELAUFEN: '#64748b',
}

export const CATEGORY_ACCENT = {
  start: '#01696f',
  anforderungen: '#006494',
  modellierung: '#7a39bb',
  synthese: '#437a22',
  produkt: '#964219',
} as const

// UML group color id -> hex (maps the JSON's color names to the palette)
export const UML_GROUP_COLOR: Record<string, string> = {
  domain: '#7a39bb',  // violet
  service: '#4f46e5', // indigo
  store: '#e11d76',   // rose
  dto: '#d19900',     // amber
  enum: '#0891b2',    // cyan
}

// Pick a readable text color (#fff or #111) for a given background hex.
export function contrastText(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return l > 0.6 ? '#111111' : '#ffffff'
}

// Best-effort color for a stateEffect string like "VorstellungSitz: FREI→RESERVIERT".
export function stateEffectColor(effect: string): string {
  const arrow = effect.includes('→') ? effect.split('→').pop()! : effect
  const token = (arrow.match(/[A-ZÄÖÜ]{3,}/) || [])[0]
  return (token && STATUS_COLORS[token]) || '#64748b'
}

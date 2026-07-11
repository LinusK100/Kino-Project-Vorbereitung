import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Kleine Anzahlen als deutsches Zahlwort (für Folien-Titel/-Texte, die aus den
// JSON-Daten berechnet werden), größere als Ziffer.
const ZAHLWORT = [
  'keine', 'eine', 'zwei', 'drei', 'vier', 'fünf', 'sechs',
  'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf',
]

export function zahlwort(n: number, capital = false): string {
  const w = ZAHLWORT[n] ?? String(n)
  return capital ? w.charAt(0).toUpperCase() + w.slice(1) : w
}

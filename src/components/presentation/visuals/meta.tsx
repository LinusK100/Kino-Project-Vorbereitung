// Folien-Visuals für den Meta-Abschnitt „Arbeitsweise". Zeigen den Ablauf,
// die Werkzeuge und die Projektdateien — Farben über die Theme-Palette.
import { motion, useReducedMotion } from 'motion/react'
import { bright, pop, pres } from './core'

const CYAN = '#0891b2'

// ── Der Ablauf einer Änderung als Fluss ──
const ABLAUF = ['Regeln', 'Ändern', 'Prüfen', 'Festhalten', 'Deployen']

export function AblaufFlow({ delayBase = 0 }: { delayBase?: number }) {
  const reduce = useReducedMotion()
  const P = pres()
  const c = bright(CYAN)
  return (
    <div className="flex items-center justify-center flex-wrap gap-x-1 gap-y-3" style={{ maxWidth: 820 }}>
      {ABLAUF.map((s, i) => (
        <span key={s} className="inline-flex items-center gap-1">
          <motion.span
            {...pop(delayBase + i, reduce)}
            className="text-[13px] font-bold px-4 py-2 rounded-xl"
            style={{ background: `${CYAN}1c`, color: c, border: `1px solid ${c}55` }}
          >
            {s}
          </motion.span>
          {i < ABLAUF.length - 1 && (
            <motion.span {...pop(delayBase + i, reduce)} className="text-lg" style={{ color: P.fgFaint }}>→</motion.span>
          )}
        </span>
      ))}
    </div>
  )
}

// ── Werkzeuge als Chips ──
const WERKZEUGE = ['Git & GitHub', 'npm · Vite · TypeScript', 'Playwright + Chrome', 'Node-Skripte', 'GitHub REST API', 'Claude Code']

export function WerkzeugChips({ delayBase = 0 }: { delayBase?: number }) {
  const reduce = useReducedMotion()
  const P = pres()
  return (
    <div className="flex items-center justify-center flex-wrap gap-2" style={{ maxWidth: 680 }}>
      {WERKZEUGE.map((w, i) => (
        <motion.span
          key={w}
          {...pop(delayBase + i, reduce)}
          className="text-[13px] font-medium px-3.5 py-2 rounded-full"
          style={{ background: P.chip, color: P.fg, border: `1px solid ${P.line}` }}
        >
          {w}
        </motion.span>
      ))}
    </div>
  )
}

// ── Ablauf + Werkzeuge auf einer Folie (Gesamt-Präsentation, Projekt-Einordnung) ──
export function ArbeitsweiseKompakt() {
  const P = pres()
  return (
    <div className="flex flex-col items-center gap-5">
      <AblaufFlow />
      <div className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: P.fgFaint }}>
        Werkzeuge
      </div>
      <WerkzeugChips delayBase={5} />
    </div>
  )
}

// ── Projektdateien als Mono-Zeilen ──
const DATEIEN: [string, string][] = [
  ['CLAUDE.md', 'die Regeln, zuerst gelesen'],
  ['docs/PROGRESS.md', 'Changelog je Änderung'],
  ['docs/ARCHITECTURE.md', 'Farb-Token & Verträge'],
  ['README.md', 'Einstieg & Live-Link'],
]

export function DateiChips() {
  const reduce = useReducedMotion()
  const P = pres()
  return (
    <div className="w-full space-y-2" style={{ maxWidth: 560 }}>
      {DATEIEN.map(([name, zweck], i) => (
        <motion.div
          key={name}
          {...pop(i, reduce)}
          className="flex items-baseline justify-between gap-3 rounded-lg px-4 py-2.5 text-left"
          style={{ background: P.chip, border: `1px solid ${P.line}` }}
        >
          <code className="text-[13px] font-semibold" style={{ color: bright(CYAN) }}>{name}</code>
          <span className="text-[12px]" style={{ color: P.fgSoft }}>{zweck}</span>
        </motion.div>
      ))}
    </div>
  )
}

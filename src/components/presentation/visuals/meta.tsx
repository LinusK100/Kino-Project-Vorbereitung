// Folien-Visuals für den Meta-Abschnitt „Arbeitsweise" (Kino-Modus, schwarzer
// Grund). Zeigen den Ablauf, die Werkzeuge und die Projektdateien.
import { motion, useReducedMotion } from 'motion/react'
import { pop } from './core'

const CYAN = '#4dd6f0'

// ── Der Ablauf einer Änderung als Fluss ──
const ABLAUF = ['Regeln', 'Ändern', 'Prüfen', 'Festhalten', 'Deployen']

export function AblaufFlow() {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-center justify-center flex-wrap gap-x-1 gap-y-3" style={{ maxWidth: 820 }}>
      {ABLAUF.map((s, i) => (
        <span key={s} className="inline-flex items-center gap-1">
          <motion.span
            {...pop(i, reduce)}
            className="text-[13px] font-bold px-4 py-2 rounded-xl"
            style={{ background: `${CYAN}1c`, color: CYAN, border: `1px solid ${CYAN}55` }}
          >
            {s}
          </motion.span>
          {i < ABLAUF.length - 1 && (
            <motion.span {...pop(i, reduce)} className="text-lg" style={{ color: 'rgba(255,255,255,0.35)' }}>→</motion.span>
          )}
        </span>
      ))}
    </div>
  )
}

// ── Werkzeuge als Chips ──
const WERKZEUGE = ['Git & GitHub', 'npm · Vite · TypeScript', 'Playwright + Chrome', 'Node-Skripte', 'GitHub REST API', 'Claude Code']

export function WerkzeugChips() {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-center justify-center flex-wrap gap-2" style={{ maxWidth: 680 }}>
      {WERKZEUGE.map((w, i) => (
        <motion.span
          key={w}
          {...pop(i, reduce)}
          className="text-[13px] font-medium px-3.5 py-2 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          {w}
        </motion.span>
      ))}
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
  return (
    <div className="w-full space-y-2" style={{ maxWidth: 560 }}>
      {DATEIEN.map(([name, zweck], i) => (
        <motion.div
          key={name}
          {...pop(i, reduce)}
          className="flex items-baseline justify-between gap-3 rounded-lg px-4 py-2.5 text-left"
          style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <code className="text-[13px] font-semibold" style={{ color: CYAN }}>{name}</code>
          <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{zweck}</span>
        </motion.div>
      ))}
    </div>
  )
}

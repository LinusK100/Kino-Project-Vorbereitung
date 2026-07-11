import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  Play, Pause, Check, ChevronLeft, ChevronRight, X, Presentation as PresentationIcon, Gauge,
} from 'lucide-react'
import type { PresentationStep } from '@/types'

interface PresentationProps {
  steps: PresentationStep[]
  accent: string
  title: string
  label?: string
  /** weißer Knopf für farbige Flächen (z. B. Dashboard-Hero) */
  invert?: boolean
  /** zeigt im Kino-Kopf, auf welchen Modus sich die Tour bezieht */
  modeLabel?: string
}

const SPEEDS = [5000, 8000, 12000]
const SPEED_LABEL: Record<number, string> = { 5000: 'schnell', 8000: 'normal', 12000: 'langsam' }
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Presentation({ steps, accent, title, label = 'Präsentation', invert, modeLabel }: PresentationProps) {
  const [active, setActive] = useState(false)
  if (steps.length === 0) return null

  return (
    <>
      <button
        onClick={() => setActive(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:-translate-y-0.5 ${invert ? '' : 'text-white'}`}
        style={invert
          ? { background: '#fff', color: accent, boxShadow: '0 2px 12px rgba(0,0,0,0.28)' }
          : { background: accent, boxShadow: `0 2px 10px ${accent}55` }}
      >
        <PresentationIcon size={14} />
        {label}
      </button>
      {active && createPortal(
        <CinemaMode steps={steps} accent={accent} title={title} modeLabel={modeLabel} onClose={() => setActive(false)} />,
        document.body,
      )}
    </>
  )
}

function CinemaMode({
  steps, accent, title, modeLabel, onClose,
}: { steps: PresentationStep[]; accent: string; title: string; modeLabel?: string; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(1)
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)

  const step = steps[index]
  const total = steps.length
  const atEnd = index === total - 1
  const go = useCallback((n: number) => setIndex(Math.max(0, Math.min(total - 1, n))), [total])

  // Seiten-Scroll sperren, solange das Kino läuft
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Fokus ins Overlay holen und beim Schließen zurückgeben (Screenreader/Tastatur)
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    rootRef.current?.focus()
    return () => opener?.focus()
  }, [])

  // Automatischer Ablauf; stoppt beim Erreichen der letzten Folie
  useEffect(() => {
    if (!playing || atEnd) return
    const id = window.setTimeout(() => {
      go(index + 1)
      if (index + 1 === total - 1) setPlaying(false)
    }, SPEEDS[speedIdx])
    return () => window.clearTimeout(id)
  }, [playing, index, atEnd, total, speedIdx, go])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') { setPlaying(false); go(index + 1) }
      else if (e.key === 'ArrowLeft') { setPlaying(false); go(index - 1) }
      else if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go, onClose])

  // Folien-Animation: sanftes Aufblenden mit gestaffelten Kind-Elementen
  const slideV = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { when: 'beforeChildren' as const } }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: EASE, when: 'beforeChildren' as const, staggerChildren: 0.07, delayChildren: 0.03 } },
        exit: { opacity: 0, y: -20, filter: 'blur(6px)', transition: { duration: 0.22, ease: 'easeIn' as const } },
      }
  const itemV = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE } } }

  return (
    <div
      ref={rootRef} tabIndex={-1}
      className="fixed inset-0 z-[100] flex flex-col outline-none"
      role="dialog" aria-modal="true" aria-label="Präsentationsmodus"
      style={{ background: 'radial-gradient(130% 100% at 50% 12%, #10101a 0%, #060608 55%, #000 100%)' }}
    >
      {/* Projektor-Schein in der Abschnittsfarbe */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: -220, left: '50%', transform: 'translateX(-50%)',
          width: 980, height: 460, filter: 'blur(60px)',
          background: `radial-gradient(closest-side, ${accent}30, transparent)`,
        }}
      />

      {/* Kopfzeile */}
      <div className="relative flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5 min-w-0 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <PresentationIcon size={16} />
          <span className="text-xs font-bold uppercase tracking-[0.18em]">Präsentation</span>
          <span className="opacity-50">·</span>
          <span className="truncate" style={{ fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.8)' }}>{title}</span>
          {modeLabel && (
            <span
              className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: `${accent}30`, color: '#fff', border: `1px solid ${accent}88` }}
              title="Die Tour zeigt die Inhalte des gewählten Modus"
            >
              {modeLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>{index + 1} / {total}</span>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-white transition-colors hover:bg-white/20"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <X size={15} /> Beenden
          </button>
        </div>
      </div>

      {/* Folie */}
      <div className="relative flex-1 flex items-center justify-center px-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            variants={slideV}
            initial="hidden" animate="show" exit="exit"
            className={step.visual ? 'w-[min(1080px,96vw)] text-center' : 'w-[min(860px,94vw)] text-center'}
            style={{ willChange: 'transform, opacity, filter' }}
          >
            <motion.p
              variants={itemV}
              className={`text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] ${step.visual ? 'mb-3' : 'mb-5'}`}
              style={{ color: accent }}
            >
              {title} · {index + 1} von {total}
            </motion.p>

            <motion.h2
              variants={itemV}
              className={`font-bold text-white leading-[1.12] ${step.visual ? 'mb-4' : 'mb-6'}`}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: step.visual ? 'clamp(1.65rem, 3.4vw, 2.5rem)' : 'clamp(2.1rem, 5.2vw, 3.6rem)',
                textWrap: 'balance',
              }}
            >
              {step.title}
            </motion.h2>

            {step.visual && (
              <motion.div variants={itemV} className="flex justify-center my-5 md:my-6 overflow-x-auto">
                {step.visual}
              </motion.div>
            )}

            <motion.p
              variants={itemV}
              className="mx-auto leading-relaxed"
              style={{
                color: step.visual ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.72)',
                fontSize: step.visual ? 'clamp(0.9rem, 1.25vw, 1.02rem)' : 'clamp(1rem, 1.6vw, 1.22rem)',
                maxWidth: step.visual ? 760 : 640,
                textWrap: 'pretty',
              }}
            >
              {step.body}
            </motion.p>

            {step.points && (
              <motion.ul variants={itemV} className="mx-auto mt-7 space-y-3 text-left" style={{ maxWidth: 560 }}>
                {step.points.map((p) => (
                  <motion.li
                    key={p}
                    variants={itemV}
                    className="flex items-start gap-3"
                    style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(0.95rem, 1.4vw, 1.08rem)' }}
                  >
                    <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                    {p}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fortschritt + Steuerung */}
      <div className="relative flex flex-col items-center gap-4 pb-7 px-6">
        <div className="flex gap-1.5 w-[min(720px,92vw)]">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setPlaying(false); go(i) }}
              aria-label={`Schritt ${i + 1}: ${s.title}`}
              className="h-1 flex-1 rounded-full overflow-hidden transition-colors"
              style={{ background: i < index ? accent : 'rgba(255,255,255,0.16)' }}
            >
              {i === index && (
                <motion.div
                  key={`${index}-${playing}-${speedIdx}`}
                  className="h-full rounded-full"
                  style={{ background: accent }}
                  initial={{ width: playing ? '0%' : '100%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: playing ? SPEEDS[speedIdx] / 1000 : 0.25, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <CtrlBtn onClick={() => { setPlaying(false); go(index - 1) }} disabled={index === 0} label="Zurück"><ChevronLeft size={19} /></CtrlBtn>
          <button
            onClick={() => { if (atEnd) onClose(); else setPlaying((p) => !p) }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: accent, boxShadow: `0 4px 18px ${accent}55` }}
          >
            {atEnd ? <Check size={16} /> : playing ? <Pause size={16} /> : <Play size={16} />}
            {atEnd ? 'Fertig' : playing ? 'Pause' : 'Automatisch'}
          </button>
          <CtrlBtn onClick={() => { setPlaying(false); if (atEnd) onClose(); else go(index + 1) }} label="Weiter"><ChevronRight size={19} /></CtrlBtn>
          <button
            onClick={() => setSpeedIdx((s) => (s + 1) % SPEEDS.length)}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-2 rounded-full ml-2 transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.18)' }}
            title="Tempo des automatischen Ablaufs"
          >
            <Gauge size={13} /> {SPEED_LABEL[SPEEDS[speedIdx]]}
          </button>
        </div>

        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.34)' }}>
          ← → Folien wechseln · Leertaste Auto · Esc beendet
        </p>
      </div>
    </div>
  )
}

function CtrlBtn({ children, onClick, disabled, label }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <button
      onClick={onClick} disabled={disabled} aria-label={label}
      className="p-2.5 rounded-full text-white transition-colors hover:bg-white/15 disabled:opacity-25"
      style={{ border: '1px solid rgba(255,255,255,0.2)' }}
    >
      {children}
    </button>
  )
}

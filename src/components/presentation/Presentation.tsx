import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  Play, Pause, ChevronLeft, ChevronRight, X, Presentation as PresentationIcon, Gauge,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import type { PresentationStep, Mode } from '@/types'

interface PresentationProps {
  steps: PresentationStep[]
  accent: string
  /** label override for the trigger button */
  label?: string
}

const SPEEDS = [4000, 6000, 9000]
const SPEED_LABEL: Record<number, string> = { 4000: 'schnell', 6000: 'normal', 9000: 'langsam' }

export function Presentation({ steps, accent, label = 'Präsentation' }: PresentationProps) {
  const [active, setActive] = useState(false)

  if (steps.length === 0) return null

  return (
    <>
      <button
        onClick={() => setActive(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
        style={{ background: accent, boxShadow: `0 2px 10px ${accent}55` }}
        data-pres-trigger
      >
        <PresentationIcon size={14} />
        {label}
      </button>
      {active && createPortal(
        <PresentationOverlay steps={steps} accent={accent} onClose={() => setActive(false)} />,
        document.body,
      )}
    </>
  )
}

function PresentationOverlay({
  steps, accent, onClose,
}: { steps: PresentationStep[]; accent: string; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(1)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const { mode, setMode } = useAppStore()
  const originalMode = useRef<Mode>(mode)

  const step = steps[index]
  const total = steps.length
  const atEnd = index === total - 1

  const go = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(total - 1, next)))
  }, [total])

  // Apply step side effects (mode switch + onEnter), then locate target.
  useEffect(() => {
    if (step.mode) setMode(step.mode)
    step.onEnter?.()
    const locate = () => {
      if (!step.target) { setRect(null); return }
      const el = document.querySelector(step.target) as HTMLElement | null
      if (!el) { setRect(null); return }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // recompute after the smooth scroll settles
      window.setTimeout(() => setRect(el.getBoundingClientRect()), 320)
    }
    const t = window.setTimeout(locate, 60)
    const onMove = () => {
      if (!step.target) return
      const el = document.querySelector(step.target) as HTMLElement | null
      if (el) setRect(el.getBoundingClientRect())
    }
    window.addEventListener('resize', onMove)
    window.addEventListener('scroll', onMove, true)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onMove)
      window.removeEventListener('scroll', onMove, true)
    }
  }, [step, setMode])

  // Auto-advance (no setState in effect — simply stop scheduling at the end)
  useEffect(() => {
    if (!playing || atEnd) return
    const id = window.setTimeout(() => go(index + 1), SPEEDS[speedIdx])
    return () => window.clearTimeout(id)
  }, [playing, index, atEnd, speedIdx, go])

  // Restore mode on unmount
  useEffect(() => () => { setMode(originalMode.current) }, [setMode])

  // Keyboard
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

  const pad = 8
  const hole = rect
    ? { left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }
    : null

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Präsentationsmodus">
      {/* Dim layer with spotlight hole */}
      {hole ? (
        <motion.div
          key={step.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute rounded-xl pointer-events-none"
          style={{
            left: hole.left, top: hole.top, width: hole.width, height: hole.height,
            boxShadow: '0 0 0 9999px rgba(8,10,20,0.74)',
            outline: `3px solid ${accent}`,
            transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'rgba(8,10,20,0.74)' }} />
      )}

      {/* Click-catcher to close on backdrop */}
      <button className="absolute inset-0 w-full h-full cursor-default" aria-label="Schließen" onClick={onClose} />

      {/* Caption card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[min(620px,92vw)] rounded-2xl p-5 shadow-2xl"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
        >
          {/* progress */}
          <div className="flex gap-1 mb-3">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setPlaying(false); go(i) }}
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{ background: i <= index ? accent : 'var(--border-color)' }}
                aria-label={`Schritt ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white flex-shrink-0"
                style={{ background: accent }}
              >
                {index + 1} / {total}
              </span>
              <h3 className="font-bold text-base truncate" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
            </div>
            <button onClick={onClose} className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5" style={{ color: 'var(--text-secondary)' }} aria-label="Präsentation beenden">
              <X size={18} />
            </button>
          </div>

          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            {step.body}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CtrlBtn onClick={() => { setPlaying(false); go(index - 1) }} disabled={index === 0} label="Zurück">
                <ChevronLeft size={18} />
              </CtrlBtn>
              <button
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: accent }}
              >
                {playing && !atEnd ? <Pause size={16} /> : <Play size={16} />}
                {atEnd ? 'Fertig' : playing ? 'Pause' : 'Auto'}
              </button>
              <CtrlBtn onClick={() => { setPlaying(false); if (atEnd) onClose(); else go(index + 1) }} label="Weiter">
                <ChevronRight size={18} />
              </CtrlBtn>
            </div>

            <button
              onClick={() => setSpeedIdx((s) => (s + 1) % SPEEDS.length)}
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
              title="Tempo der Auto-Wiedergabe"
            >
              <Gauge size={13} /> {SPEED_LABEL[SPEEDS[speedIdx]]}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function CtrlBtn({ children, onClick, disabled, label }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="p-2 rounded-xl transition-colors disabled:opacity-30"
      style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
    >
      {children}
    </button>
  )
}

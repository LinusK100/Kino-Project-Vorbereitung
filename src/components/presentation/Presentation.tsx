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
  title: string
  label?: string
}

const SPEEDS = [4000, 6000, 9000]
const SPEED_LABEL: Record<number, string> = { 4000: 'schnell', 6000: 'normal', 9000: 'langsam' }

export function Presentation({ steps, accent, title, label = 'Präsentation' }: PresentationProps) {
  const [active, setActive] = useState(false)
  if (steps.length === 0) return null

  return (
    <>
      <button
        onClick={() => setActive(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
        style={{ background: accent, boxShadow: `0 2px 10px ${accent}55` }}
      >
        <PresentationIcon size={14} />
        {label}
      </button>
      {active && createPortal(
        <PresentationMode steps={steps} accent={accent} title={title} onClose={() => setActive(false)} />,
        document.body,
      )}
    </>
  )
}

function PresentationMode({
  steps, accent, title, onClose,
}: { steps: PresentationStep[]; accent: string; title: string; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(1)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const { mode, setMode } = useAppStore()
  const originalMode = useRef<Mode>(mode)

  const step = steps[index]
  const total = steps.length
  const atEnd = index === total - 1
  const go = useCallback((n: number) => setIndex(Math.max(0, Math.min(total - 1, n))), [total])

  // Lock page scroll while presenting
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Apply step effects + locate the spotlight target
  useEffect(() => {
    if (step.mode) setMode(step.mode)
    step.onEnter?.()
    const locate = () => {
      if (!step.target) { setRect(null); return }
      const el = document.querySelector(step.target) as HTMLElement | null
      if (!el) { setRect(null); return }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => setRect(el.getBoundingClientRect()), 340)
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

  // Auto-advance
  useEffect(() => {
    if (!playing || atEnd) return
    const id = window.setTimeout(() => go(index + 1), SPEEDS[speedIdx])
    return () => window.clearTimeout(id)
  }, [playing, index, atEnd, speedIdx, go])

  useEffect(() => () => { setMode(originalMode.current) }, [setMode])

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

  const BAR = 56
  const pad = 10
  const hole = rect ? {
    left: Math.max(4, rect.left - pad),
    top: Math.max(BAR + 4, rect.top - pad),
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  } : null

  const scrim = 'rgba(10,12,22,0.62)'
  const panel = (style: React.CSSProperties) => (
    <div className="fixed" style={{ background: scrim, backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', ...style }} />
  )

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Präsentationsmodus">
      {/* Blurred surround (4 panels leaving a crisp spotlight hole) */}
      {hole ? (
        <>
          {panel({ left: 0, top: BAR, width: '100vw', height: Math.max(0, hole.top - BAR) })}
          {panel({ left: 0, top: hole.top + hole.height, width: '100vw', bottom: 0 })}
          {panel({ left: 0, top: hole.top, width: hole.left, height: hole.height })}
          {panel({ left: hole.left + hole.width, top: hole.top, right: 0, height: hole.height })}
          <motion.div
            key={step.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed rounded-xl pointer-events-none"
            style={{
              left: hole.left, top: hole.top, width: hole.width, height: hole.height,
              outline: `2.5px solid ${accent}`, boxShadow: `0 0 0 2px ${accent}40, 0 0 28px ${accent}55`,
              transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </>
      ) : (
        panel({ inset: 0, top: BAR })
      )}

      {/* Presentation top bar */}
      <div className="fixed top-0 inset-x-0 flex items-center justify-between px-4 text-white z-[2]" style={{ height: BAR, background: accent }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <PresentationIcon size={18} />
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">Präsentation</span>
          <span className="opacity-50">·</span>
          <span className="font-semibold truncate" style={{ fontFamily: 'var(--font-display)' }}>{title}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-mono opacity-90">{index + 1} / {total}</span>
          <button onClick={onClose} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <X size={16} /> Beenden
          </button>
        </div>
      </div>

      {/* Caption panel */}
      <div className="fixed inset-x-0 bottom-0 flex justify-center px-4 pb-6 z-[2] pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-[min(720px,94vw)] rounded-2xl p-5 shadow-2xl pointer-events-auto"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex gap-1 mb-3">
              {steps.map((s, i) => (
                <button key={s.id} onClick={() => { setPlaying(false); go(i) }} aria-label={`Schritt ${i + 1}`}
                  className="h-1.5 flex-1 rounded-full transition-all" style={{ background: i <= index ? accent : 'var(--border-color)' }} />
              ))}
            </div>

            <h3 className="font-bold text-lg md:text-xl mb-1.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{step.title}</h3>
            <p className="text-sm md:text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{step.body}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CtrlBtn onClick={() => { setPlaying(false); go(index - 1) }} disabled={index === 0} label="Zurück"><ChevronLeft size={18} /></CtrlBtn>
                <button onClick={() => setPlaying((p) => !p)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: accent }}>
                  {playing && !atEnd ? <Pause size={16} /> : <Play size={16} />}
                  {atEnd ? 'Fertig' : playing ? 'Pause' : 'Automatisch'}
                </button>
                <CtrlBtn onClick={() => { setPlaying(false); if (atEnd) onClose(); else go(index + 1) }} label="Weiter"><ChevronRight size={18} /></CtrlBtn>
              </div>
              <button onClick={() => setSpeedIdx((s) => (s + 1) % SPEEDS.length)} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }} title="Tempo">
                <Gauge size={13} /> {SPEED_LABEL[SPEEDS[speedIdx]]}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function CtrlBtn({ children, onClick, disabled, label }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label}
      className="p-2 rounded-xl transition-colors disabled:opacity-30" style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
      {children}
    </button>
  )
}

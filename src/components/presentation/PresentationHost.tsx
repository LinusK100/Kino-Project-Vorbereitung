// Globaler Präsentations-Host: EIN Overlay über den Routen (App.tsx), gesteuert
// über den Store. Die Gesamt-Präsentation läuft über Abschnittsgrenzen hinweg —
// beim Folienwechsel navigiert der Hintergrund still zur passenden Seite, das
// opake Overlay bleibt stehen: eine Präsentation, nicht neun.
// Öffnet laut Vorgabe immer hell; dunkel per Knopf im Kopf. Kein Auto-Modus.
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  Check, ChevronLeft, ChevronRight, Moon, Sun, X, Presentation as PresentationIcon,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useGesamt, usePresentation, SECTION_META, type GesamtSlide } from './steps'
import { bright, pres } from './visuals/core'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function PresentationHost() {
  const run = useAppStore((s) => s.pres)
  if (!run) return null
  return <CinemaMode key={`${run.scope}-${run.section}`} />
}

function CinemaMode() {
  const run = useAppStore((s) => s.pres)!
  const presTheme = useAppStore((s) => s.presTheme)
  const togglePresTheme = useAppStore((s) => s.togglePresTheme)
  const setPresIndex = useAppStore((s) => s.setPresIndex)
  const closePres = useAppStore((s) => s.closePres)
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const gesamtDeck = useGesamt()
  const sectionSteps = usePresentation(run.section)
  const deck: GesamtSlide[] = useMemo(
    () => (run.scope === 'gesamt'
      ? gesamtDeck
      : sectionSteps.map((s) => ({ ...s, abschnitt: run.section }))),
    [run.scope, run.section, gesamtDeck, sectionSteps],
  )

  const total = deck.length
  const index = Math.max(0, Math.min(total - 1, run.index))
  const step = deck[index]
  const atEnd = index === total - 1
  const meta = SECTION_META[step?.abschnitt ?? 'start'] ?? SECTION_META.start
  const P = pres()
  const light = presTheme === 'light'
  const acc = bright(meta.accent)

  const go = useCallback(
    (n: number) => setPresIndex(Math.max(0, Math.min(total - 1, n))),
    [total, setPresIndex],
  )
  // Beenden merkt sich die Stelle der Gesamt-Präsentation („Ab hier weitermachen");
  // ein Abschluss auf der letzten Folie setzt sie zurück.
  const close = useCallback(
    () => closePres(atEnd ? null : index),
    [closePres, atEnd, index],
  )

  // Hintergrund folgt dem Abschnitt der aktuellen Folie — unsichtbar unter dem
  // opaken Overlay, aber beim Beenden steht man auf der richtigen Seite.
  useEffect(() => {
    if (step && location.pathname !== meta.path) navigate(meta.path)
  }, [step, meta.path, location.pathname, navigate])

  // Seiten-Scroll sperren, solange die Präsentation läuft
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(index + 1)
      else if (e.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go, close])

  if (!step) return null

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

  const titelFolie = step.art === 'titel'

  return createPortal(
    <div
      ref={rootRef} tabIndex={-1}
      className="fixed inset-0 z-[100] flex flex-col outline-none"
      role="dialog" aria-modal="true" aria-label="Präsentationsmodus"
      data-pres-theme={presTheme}
      style={{
        background: light
          ? `radial-gradient(120% 70% at 50% 0%, ${meta.accent}0c 0%, transparent 55%), #ffffff`
          : 'radial-gradient(130% 100% at 50% 12%, #10101a 0%, #060608 55%, #000 100%)',
        transition: 'background 0.4s',
      }}
    >
      {/* Projektor-Schein in der Abschnittsfarbe (nur dunkel) */}
      {!light && (
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: -220, left: '50%', transform: 'translateX(-50%)',
            width: 980, height: 460, filter: 'blur(60px)',
            background: `radial-gradient(closest-side, ${meta.accent}30, transparent)`,
          }}
        />
      )}

      {/* Kopfzeile */}
      <div className="relative flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5 min-w-0 text-sm" style={{ color: P.fgFaint }}>
          <PresentationIcon size={16} />
          <span className="text-xs font-bold uppercase tracking-[0.18em]">Präsentation</span>
          <span className="opacity-50">·</span>
          <span className="truncate" style={{ fontFamily: 'var(--font-display)', color: P.fgSoft }}>
            {run.scope === 'gesamt' ? 'CineTicket — Systemanalyse und Entwurf' : meta.label}
          </span>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="text-sm font-mono" style={{ color: P.fgFaint }}>{index + 1} / {total}</span>
          <button
            onClick={togglePresTheme}
            aria-label={light ? 'Dunkler Modus' : 'Heller Modus'}
            title={light ? 'Dunkler Modus' : 'Heller Modus'}
            className="p-2 rounded-lg transition-colors"
            style={{ color: P.fgSoft, border: `1px solid ${P.line}` }}
          >
            {light ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <button
            onClick={close}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: P.chipStrong, color: P.fg }}
          >
            <X size={15} /> Beenden
          </button>
        </div>
      </div>

      {/* Folie */}
      <div className="relative flex-1 flex items-center justify-center px-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${step.id}-${presTheme}`}
            variants={slideV}
            initial="hidden" animate="show" exit="exit"
            className={step.visual ? 'w-[min(1080px,96vw)] text-center' : 'w-[min(860px,94vw)] text-center'}
            style={{ willChange: 'transform, opacity, filter' }}
          >
            <motion.p
              variants={itemV}
              className={`text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] ${step.visual ? 'mb-3' : 'mb-5'}`}
              style={{ color: acc }}
            >
              {titelFolie ? 'Systemanalyse und Entwurf' : `${meta.label} · ${index + 1} von ${total}`}
            </motion.p>

            <motion.h2
              variants={itemV}
              className={`font-bold leading-[1.12] ${step.visual ? 'mb-4' : 'mb-6'}`}
              style={{
                fontFamily: 'var(--font-display)',
                color: P.fg,
                fontSize: titelFolie
                  ? 'clamp(3rem, 8vw, 5.2rem)'
                  : step.visual ? 'clamp(1.65rem, 3.4vw, 2.5rem)' : 'clamp(2.1rem, 5.2vw, 3.6rem)',
                textWrap: 'balance',
              }}
            >
              {step.title}
            </motion.h2>

            {titelFolie && (
              <motion.div variants={itemV} className="mx-auto mb-6 rounded-full" style={{ width: 110, height: 5, background: acc }} />
            )}

            {step.visual && (
              <motion.div variants={itemV} className="flex justify-center my-5 md:my-6 overflow-x-auto">
                {step.visual}
              </motion.div>
            )}

            <motion.p
              variants={itemV}
              className="mx-auto leading-relaxed"
              style={{
                color: step.visual ? P.fgSoft : P.fgSoft,
                fontSize: titelFolie
                  ? 'clamp(1.05rem, 1.8vw, 1.3rem)'
                  : step.visual ? 'clamp(0.9rem, 1.25vw, 1.02rem)' : 'clamp(1rem, 1.6vw, 1.22rem)',
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
                    style={{ color: P.fg, fontSize: 'clamp(0.95rem, 1.4vw, 1.08rem)' }}
                  >
                    <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: acc, boxShadow: light ? undefined : `0 0 8px ${acc}` }} />
                    {p}
                  </motion.li>
                ))}
              </motion.ul>
            )}

            {/* Kernsatz-Banner (aus der PPT-Vorlage übernommen) */}
            {step.kernsatz && (
              <motion.div
                variants={itemV}
                className="mx-auto mt-6 rounded-xl px-5 py-3 text-[13px] md:text-[13.5px] font-semibold leading-snug"
                style={{
                  maxWidth: 760,
                  background: light ? `${meta.accent}0e` : `${meta.accent}26`,
                  border: `1px solid ${acc}44`,
                  color: P.fg,
                }}
              >
                {step.kernsatz}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Abschnitts-Timeline + Steuerung */}
      <div className="relative flex flex-col items-center gap-3.5 pb-6 px-6">
        <Timeline deck={deck} index={index} onJump={go} light={light} />

        <div className="flex items-center gap-2.5">
          <CtrlBtn onClick={() => go(index - 1)} disabled={index === 0} label="Zurück" light={light}>
            <ChevronLeft size={19} />
          </CtrlBtn>
          <button
            onClick={() => { if (atEnd) close(); else go(index + 1) }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: meta.accent, boxShadow: `0 4px 18px ${meta.accent}55` }}
          >
            {atEnd ? <Check size={16} /> : <ChevronRight size={16} />}
            {atEnd ? 'Fertig' : 'Weiter'}
          </button>
        </div>

        <p className="text-[11px]" style={{ color: P.fgFaint }}>
          ← → Folien wechseln · Esc beendet
        </p>
      </div>
    </div>,
    document.body,
  )
}

// ── Timeline unten: Abschnitte mit Folien-Segmenten (aus der PPT-Vorlage) ──
// Exportiert für die Druck-Ansicht (/praesentation/druck).
interface TimelineGroup { abschnitt: string; start: number; count: number }

export function Timeline({ deck, index, onJump, light }: {
  deck: GesamtSlide[]; index: number; onJump: (i: number) => void; light: boolean
}) {
  const P = pres()
  const groups = useMemo(() => {
    const gs: TimelineGroup[] = []
    deck.forEach((s, i) => {
      const last = gs[gs.length - 1]
      if (last && last.abschnitt === s.abschnitt) last.count += 1
      else gs.push({ abschnitt: s.abschnitt, start: i, count: 1 })
    })
    return gs
  }, [deck])

  const single = groups.length === 1
  return (
    <div className="flex items-end gap-2.5 w-[min(980px,94vw)]" role="tablist" aria-label="Abschnitte der Präsentation">
      {groups.map((g) => {
        const meta = SECTION_META[g.abschnitt] ?? SECTION_META.start
        const active = index >= g.start && index < g.start + g.count
        const done = index >= g.start + g.count
        const acc = bright(meta.accent)
        return (
          <div key={`${g.abschnitt}-${g.start}`} className="flex flex-col gap-1.5 min-w-0" style={{ flexGrow: g.count, flexBasis: 0 }}>
            <div className="flex gap-[3px]">
              {Array.from({ length: g.count }).map((_, j) => {
                const i = g.start + j
                return (
                  <button
                    key={i}
                    onClick={() => onJump(i)}
                    aria-label={`Folie ${i + 1}: ${deck[i].title}`}
                    className="h-[5px] flex-1 rounded-full transition-colors"
                    style={{
                      background: i < index ? acc : i === index ? acc : light ? 'rgba(18,32,54,0.14)' : 'rgba(255,255,255,0.16)',
                      opacity: i === index ? 1 : i < index ? 0.55 : 1,
                      outline: i === index ? `2px solid ${acc}55` : undefined,
                      outlineOffset: 1,
                    }}
                  />
                )
              })}
            </div>
            {!single && (
              <span
                className={`text-[9.5px] leading-none uppercase tracking-wide truncate text-center ${active ? '' : 'hidden md:block'}`}
                style={{
                  color: active ? acc : done ? P.fgFaint : P.fgFaint,
                  fontWeight: active ? 700 : 500,
                }}
              >
                {meta.kurz}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function CtrlBtn({ children, onClick, disabled, label, light }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string; light: boolean
}) {
  return (
    <button
      onClick={onClick} disabled={disabled} aria-label={label}
      className="p-2.5 rounded-full transition-colors disabled:opacity-25"
      style={{
        border: `1px solid ${light ? 'rgba(18,32,54,0.25)' : 'rgba(255,255,255,0.2)'}`,
        color: light ? '#122036' : '#fff',
      }}
    >
      {children}
    </button>
  )
}

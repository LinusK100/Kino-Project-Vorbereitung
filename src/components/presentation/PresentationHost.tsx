// Globaler Präsentations-Host: EIN Overlay über den Routen (App.tsx), gesteuert
// über den Store. Die Gesamt-Präsentation läuft über Abschnittsgrenzen hinweg —
// beim Folienwechsel navigiert der Hintergrund still zur passenden Seite, das
// opake Overlay bleibt stehen: eine Präsentation, nicht neun.
// Öffnet laut Vorgabe immer hell; dunkel per Knopf im Kopf. Kein Auto-Modus.
// Das Folien-Layout selbst (PPT-Anmutung, volle Fläche) liegt in SlideView.
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import {
  Check, ChevronLeft, ChevronRight, Moon, Sun, X, Presentation as PresentationIcon,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useGesamt, usePresentation, SECTION_META, type GesamtSlide } from './steps'
import { bright, pres } from './visuals/core'
import { SlideCard, SlideView } from './SlideView'

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
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const gesamtDeck = useGesamt()
  const sectionSteps = usePresentation(run.section)
  // „Nur diesen Abschnitt" zeigt exakt die Folien der Gesamt-Präsentation dieses
  // Abschnitts (inkl. Überschreibungen aus dem Drehbuch) — gleicher Inhalt, nur
  // kürzer. Abschnitte ohne eigene Gesamt-Folien (Website-Tour, Arbeitsweise)
  // behalten ihre eigenständige Tour.
  const deck: GesamtSlide[] = useMemo(() => {
    if (run.scope === 'gesamt') return gesamtDeck
    const teil = gesamtDeck.filter((s) => s.abschnitt === run.section)
    return teil.length > 0 ? teil : sectionSteps.map((s) => ({ ...s, abschnitt: run.section }))
  }, [run.scope, run.section, gesamtDeck, sectionSteps])

  const total = deck.length
  const index = Math.max(0, Math.min(total - 1, run.index))
  const step = deck[index]
  const atEnd = index === total - 1
  const meta = SECTION_META[step?.abschnitt ?? 'start'] ?? SECTION_META.start
  const light = presTheme === 'light'

  const go = useCallback(
    (n: number) => setPresIndex(Math.max(0, Math.min(total - 1, n))),
    [total, setPresIndex],
  )
  // Beenden merkt sich die Stelle der Gesamt-Präsentation („Ab hier weitermachen");
  // ein Abschluss auf der letzten Folie setzt sie zurück. Wer die Gesamt-
  // Präsentation zu Ende geführt hat („Fertig"), landet oben auf dem Dashboard.
  const close = useCallback(() => {
    const heim = atEnd && run.scope === 'gesamt'
    closePres(atEnd ? null : index)
    if (heim) {
      if (location.pathname !== '/') navigate('/')
      // Scroll erst nach dem Schließen zurücksetzen — solange das Overlay offen
      // ist, sperrt body.overflow die Seite.
      requestAnimationFrame(() => window.scrollTo(0, 0))
    }
  }, [closePres, atEnd, index, run.scope, location.pathname, navigate])

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

  return createPortal(
    <div
      ref={rootRef} tabIndex={-1}
      className="fixed inset-0 z-[100] flex flex-col outline-none"
      role="dialog" aria-modal="true" aria-label="Präsentationsmodus"
      data-pres-theme={presTheme}
      style={{
        background: light
          ? `radial-gradient(120% 80% at 50% 0%, ${meta.accent}14 0%, transparent 55%), linear-gradient(180deg, #eef1f6 0%, #e6eaf1 100%)`
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

      <PresHeaderBar
        light={light} accent={meta.accent}
        titel={run.scope === 'gesamt' ? 'CineTicket — Systemanalyse und Entwurf' : meta.label}
        index={index} total={total}
        onToggleTheme={togglePresTheme} onClose={close}
      />

      {/* Folie als Karte auf der Bühne — nutzt fast die ganze Fläche (Smart Board) */}
      <div className="relative flex-1 min-h-0 px-5 md:px-10 pt-4 pb-3">
        <SlideCard light={light} accent={meta.accent}>
          <AnimatePresence mode="wait">
            <SlideView key={`${step.id}-${presTheme}`} step={step} />
          </AnimatePresence>
        </SlideCard>
      </div>

      <PresFootBar
        deck={deck} index={index} light={light} accent={meta.accent} atEnd={atEnd}
        onJump={go} onPrev={() => go(index - 1)} onNext={() => { if (atEnd) close(); else go(index + 1) }}
      />
    </div>,
    document.body,
  )
}

// ── Kopf- und Fußleiste: geteilt zwischen Live-Präsentation und Druck-Route,
// damit das PDF exakt wie die Präsentation aussieht. ──
export function PresHeaderBar({ light, accent, titel, index, total, onToggleTheme, onClose }: {
  light: boolean; accent: string; titel: string; index: number; total: number
  onToggleTheme?: () => void; onClose?: () => void
}) {
  const P = pres()
  return (
    <div
      className="relative flex items-center justify-between px-5 py-2.5 flex-shrink-0"
      style={{
        background: light
          ? `linear-gradient(180deg, ${accent}16 0%, ${accent}0a 100%)`
          : 'rgba(255,255,255,0.05)',
        borderBottom: `1px solid ${light ? `${accent}2e` : 'rgba(255,255,255,0.1)'}`,
        transition: 'background 0.4s, border-color 0.4s',
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0 text-sm" style={{ color: P.fgFaint }}>
        <PresentationIcon size={16} />
        <span className="text-xs font-bold uppercase tracking-[0.18em]">Präsentation</span>
        <span className="opacity-50">·</span>
        <span className="truncate" style={{ fontFamily: 'var(--font-display)', color: P.fgSoft }}>{titel}</span>
      </div>
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <span className="text-sm font-mono" style={{ color: P.fgFaint }}>{index + 1} / {total}</span>
        <button
          onClick={onToggleTheme}
          aria-label={light ? 'Dunkler Modus' : 'Heller Modus'}
          title={light ? 'Dunkler Modus' : 'Heller Modus'}
          className="p-2 rounded-lg transition-colors"
          style={{ color: P.fgSoft, border: `1px solid ${P.line}` }}
        >
          {light ? <Moon size={15} /> : <Sun size={15} />}
        </button>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: P.chipStrong, color: P.fg }}
        >
          <X size={15} /> Beenden
        </button>
      </div>
    </div>
  )
}

export function PresFootBar({ deck, index, light, accent, atEnd, onJump, onPrev, onNext }: {
  deck: GesamtSlide[]; index: number; light: boolean; accent: string; atEnd: boolean
  onJump?: (i: number) => void; onPrev?: () => void; onNext?: () => void
}) {
  return (
    <div className="relative flex items-center gap-4 md:gap-6 px-6 md:px-10 pb-5 pt-1 flex-shrink-0">
      <CtrlBtn onClick={onPrev ?? (() => {})} disabled={index === 0} label="Zurück" light={light}>
        <ChevronLeft size={19} />
      </CtrlBtn>
      <Timeline deck={deck} index={index} onJump={onJump ?? (() => {})} light={light} />
      <button
        onClick={onNext}
        title={atEnd ? 'Präsentation beenden' : 'Nächste Folie (→)'}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-semibold transition-transform hover:-translate-y-0.5 flex-shrink-0"
        style={{ background: accent, boxShadow: `0 4px 16px ${accent}50` }}
      >
        {atEnd ? <Check size={16} /> : <ChevronRight size={16} />}
        {atEnd ? 'Fertig' : 'Weiter'}
      </button>
    </div>
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
    <div className="flex items-end gap-2.5 flex-1 min-w-0" role="tablist" aria-label="Abschnitte der Präsentation">
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
      className="p-2 rounded-full transition-colors disabled:opacity-25"
      style={{
        border: `1px solid ${light ? 'rgba(18,32,54,0.25)' : 'rgba(255,255,255,0.2)'}`,
        color: light ? '#122036' : '#fff',
      }}
    >
      {children}
    </button>
  )
}

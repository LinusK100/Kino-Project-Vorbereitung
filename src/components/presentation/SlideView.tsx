// Folien-Design: Die Folie liegt als große abgerundete Karte („Slide-Card")
// auf einer ruhigen Bühne. In der Karte: Abschnitts-Chip, kräftiger Sans-Titel,
// farbige Subline, das Visual groß in der Mitte, die Stichpunkte als
// gleichmäßige Info-Karten darunter, Kernsatz-Banner am Fuß.
// Wird vom PresentationHost UND von der Druck-Route verwendet: PDF = Vortrag.
import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useAppStore } from '@/store/appStore'
import { SECTION_META, type GesamtSlide } from './steps'
import { bright, pres } from './visuals/core'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── Die Karte: abgerundetes Rechteck mit Akzentkante oben ──
export function SlideCard({ light, accent, children }: {
  light: boolean; accent: string; children: React.ReactNode
}) {
  return (
    <div
      className="relative h-full w-[min(1560px,96vw)] mx-auto rounded-[26px] overflow-hidden flex flex-col"
      style={{
        background: light ? '#ffffff' : '#13131c',
        border: `1px solid ${light ? 'rgba(18,32,54,0.08)' : 'rgba(255,255,255,0.09)'}`,
        boxShadow: light
          ? '0 30px 90px -30px rgba(18,32,54,0.35), 0 4px 18px rgba(18,32,54,0.06)'
          : `0 30px 90px -30px rgba(0,0,0,0.9), 0 0 60px -30px ${accent}66`,
      }}
    >
      {/* Akzentkante in der Abschnittsfarbe */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[5px]"
        style={{ background: `linear-gradient(90deg, ${accent}, ${bright(accent)})`, transition: 'background 0.4s' }}
      />
      <div className="flex-1 min-h-0 px-8 md:px-12 pt-7 md:pt-8 pb-6 md:pb-7 flex flex-col">
        {children}
      </div>
    </div>
  )
}

export function SlideView({ step }: { step: GesamtSlide }) {
  const presTheme = useAppStore((s) => s.presTheme)
  const reduce = useReducedMotion()
  const meta = SECTION_META[step.abschnitt] ?? SECTION_META.start
  const P = pres()
  const light = presTheme === 'light'
  const acc = bright(meta.accent)

  const slideV = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { when: 'beforeChildren' as const } }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: EASE, when: 'beforeChildren' as const, staggerChildren: 0.06, delayChildren: 0.02 } },
        exit: { opacity: 0, y: -14, transition: { duration: 0.18, ease: 'easeIn' as const } },
      }
  const itemV = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } } }

  // ── Titelfolie: zentriert in der Karte ──
  if (step.art === 'titel') {
    return (
      <motion.div
        variants={slideV} initial="hidden" animate="show" exit="exit"
        className="h-full w-full flex flex-col items-center justify-center text-center"
      >
        <motion.span
          variants={itemV}
          className="inline-block text-[11px] md:text-xs font-bold uppercase tracking-[0.24em] px-4 py-1.5 rounded-full mb-7"
          style={{ background: `${meta.accent}14`, color: acc, border: `1px solid ${acc}33` }}
        >
          Systemanalyse und Entwurf
        </motion.span>
        <motion.h2
          variants={itemV} className="font-bold leading-none mb-7"
          style={{ fontFamily: 'var(--font-body)', color: P.fg, fontSize: 'clamp(3.2rem, 9vw, 6.5rem)', letterSpacing: '-0.02em', textWrap: 'balance' }}
        >
          {step.title}
        </motion.h2>
        <motion.div variants={itemV} className="rounded-full mb-7" style={{ width: 130, height: 6, background: `linear-gradient(90deg, ${meta.accent}, ${acc})` }} />
        <motion.p variants={itemV} className="leading-relaxed" style={{ color: P.fgSoft, fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)', maxWidth: 700, textWrap: 'pretty' }}>
          {step.body}
        </motion.p>
      </motion.div>
    )
  }

  const points = step.points ?? []
  const hasVisual = !!step.visual

  return (
    <motion.div
      variants={slideV} initial="hidden" animate="show" exit="exit"
      className="h-full w-full flex flex-col text-left"
    >
      {/* Kopf: Abschnitts-Chip, kräftiger Titel, farbige Subline */}
      <motion.div variants={itemV} className="flex-shrink-0">
        <span
          className="inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3"
          style={{ background: `${meta.accent}14`, color: acc, border: `1px solid ${acc}30` }}
        >
          {meta.label}
        </span>
        <h2
          className="font-bold leading-[1.06] mb-1.5"
          style={{
            fontFamily: 'var(--font-body)', color: P.fg, textWrap: 'balance', letterSpacing: '-0.015em',
            fontSize: hasVisual ? 'clamp(1.7rem, 2.7vw, 2.5rem)' : 'clamp(1.9rem, 3.1vw, 2.8rem)',
          }}
        >
          {step.title}
        </h2>
        {step.body && (
          <p className="font-semibold leading-snug" style={{ color: acc, fontSize: 'clamp(0.98rem, 1.3vw, 1.18rem)', maxWidth: '92ch' }}>
            {step.body}
          </p>
        )}
      </motion.div>

      {/* Mitte: das Visual, groß und zentriert */}
      <motion.div variants={itemV} className="flex-1 min-h-0 flex items-center justify-center py-4">
        {hasVisual
          ? <FitVisual>{step.visual}</FitVisual>
          : points.length === 0 && (
            <p className="text-center leading-relaxed mx-auto" style={{ color: P.fg, fontSize: 'clamp(1.2rem, 2vw, 1.7rem)', maxWidth: '44ch', textWrap: 'pretty' }}>
              {step.body}
            </p>
          )}
        {!hasVisual && points.length > 0 && (
          <div className="w-full max-w-3xl mx-auto space-y-3.5">
            {points.map((p) => (
              <div
                key={p} className="flex items-start gap-3.5 rounded-2xl px-6 py-4"
                style={{ background: P.chip, border: `1px solid ${P.line}` }}
              >
                <span className="mt-[0.45em] w-2 h-2 rounded-full flex-shrink-0" style={{ background: acc }} />
                <span style={{ color: P.fg, fontSize: 'clamp(1.02rem, 1.5vw, 1.25rem)' }}>{p}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Stichpunkte als gleichmäßige Info-Karten unter dem Visual */}
      {hasVisual && points.length > 0 && (
        <motion.div
          variants={itemV}
          className="flex-shrink-0 grid gap-2.5 mb-2.5"
          style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
        >
          {points.map((p) => (
            <div
              key={p} className="flex items-start gap-2.5 rounded-xl px-4 py-3"
              style={{ background: P.chip, border: `1px solid ${P.line}` }}
            >
              <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: acc }} />
              <span className="leading-snug" style={{ color: P.fg, fontSize: 'clamp(0.85rem, 1.05vw, 0.98rem)' }}>{p}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Kernsatz-Banner am Fuß der Karte */}
      {step.kernsatz && (
        <motion.div
          variants={itemV}
          className="flex-shrink-0 rounded-xl px-6 py-3 text-center font-semibold leading-snug"
          style={{
            background: light ? `${meta.accent}0f` : `${meta.accent}26`,
            border: `1px solid ${acc}38`,
            color: P.fg,
            fontSize: 'clamp(0.92rem, 1.2vw, 1.08rem)',
          }}
        >
          {step.kernsatz}
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Visual auf die Fläche skalieren (Smart Board / Druck) ──
// Misst die Naturgröße (offsetWidth/-Height sind zoom-unabhängig) und wählt
// den Zoom so, dass Breite UND Höhe passen.
function FitVisual({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)

  useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    const measure = () => {
      const w = inner.offsetWidth
      const h = inner.offsetHeight
      if (!w || !h || !outer.clientWidth || !outer.clientHeight) return
      const z = Math.min(outer.clientWidth / w, outer.clientHeight / h) * 0.95
      setZoom(Math.max(0.5, Math.min(1.45, z)))
    }
    measure()
    // Nach dem gestaffelten Einblenden einmal nachmessen (Layout kann wachsen)
    const t = window.setTimeout(measure, 500)
    const ro = new ResizeObserver(measure)
    ro.observe(outer)
    ro.observe(inner)
    return () => { window.clearTimeout(t); ro.disconnect() }
  }, [])

  return (
    <div ref={outerRef} className="w-full h-full min-h-0 flex items-center justify-center overflow-hidden">
      {/* max-content: das Visual bricht nie um, sondern wird als Ganzes skaliert
          (sonst wrappen breite Diagramme bei schmaler Druck-/Fensterbreite) */}
      <div ref={innerRef} style={{ zoom, width: 'max-content', maxWidth: 'none' }}>
        {children}
      </div>
    </div>
  )
}

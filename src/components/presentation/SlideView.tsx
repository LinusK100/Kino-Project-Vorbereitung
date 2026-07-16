// Eine Folie im Präsentations-Layout nach PPT-Vorbild (Systemanalyse_CI_CD):
// Titel links, farbige Subline, kurze Akzentlinie, Stichpunkte links neben dem
// Visual, Kernsatz-Banner unten. Visuals werden maßvoll auf die Fläche
// skaliert (FitVisual), damit alles ähnlich groß wirkt. Wird vom
// PresentationHost UND von der Druck-Route verwendet: PDF = Vortrag.
import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useAppStore } from '@/store/appStore'
import { SECTION_META, type GesamtSlide } from './steps'
import { bright, pres } from './visuals/core'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

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
        hidden: { opacity: 0, y: 20, filter: 'blur(7px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.38, ease: EASE, when: 'beforeChildren' as const, staggerChildren: 0.06, delayChildren: 0.03 } },
        exit: { opacity: 0, y: -16, filter: 'blur(5px)', transition: { duration: 0.2, ease: 'easeIn' as const } },
      }
  const itemV = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } } }

  // ── Titelfolie: zentriert ──
  if (step.art === 'titel') {
    return (
      <motion.div
        variants={slideV} initial="hidden" animate="show" exit="exit"
        className="h-full w-full flex flex-col items-center justify-center text-center"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <motion.p variants={itemV} className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-5" style={{ color: acc }}>
          Systemanalyse und Entwurf
        </motion.p>
        <motion.h2
          variants={itemV} className="font-bold leading-none mb-6"
          style={{ fontFamily: 'var(--font-display)', color: P.fg, fontSize: 'clamp(3rem, 8.5vw, 6rem)', textWrap: 'balance' }}
        >
          {step.title}
        </motion.h2>
        <motion.div variants={itemV} className="rounded-full mb-6" style={{ width: 110, height: 5, background: acc }} />
        <motion.p variants={itemV} className="leading-relaxed" style={{ color: P.fgSoft, fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)', maxWidth: 680, textWrap: 'pretty' }}>
          {step.body}
        </motion.p>
      </motion.div>
    )
  }

  const hasPoints = !!step.points?.length
  const hasVisual = !!step.visual

  return (
    <motion.div
      variants={slideV} initial="hidden" animate="show" exit="exit"
      className="h-full w-full flex flex-col text-left"
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {/* Kopf: Titel + farbige Subline (wie in der PPT-Vorlage) */}
      <motion.div variants={itemV} className="flex-shrink-0">
        <h2
          className="font-bold leading-[1.1] mb-1.5"
          style={{
            fontFamily: 'var(--font-display)', color: P.fg, textWrap: 'balance',
            fontSize: hasVisual ? 'clamp(1.45rem, 2.3vw, 2.1rem)' : 'clamp(1.7rem, 2.8vw, 2.4rem)',
          }}
        >
          {step.title}
        </h2>
        {step.body && (
          <p className="font-semibold leading-snug" style={{ color: acc, fontSize: 'clamp(0.92rem, 1.2vw, 1.08rem)', maxWidth: '90ch' }}>
            {step.body}
          </p>
        )}
        <div className="rounded-full mt-2.5" style={{ width: 52, height: 3, background: acc }} />
      </motion.div>

      {/* Inhalt: Stichpunkte links, Visual rechts (oder eines von beiden) */}
      <motion.div variants={itemV} className="flex-1 min-h-0 flex items-center justify-center gap-8 py-4">
        {hasPoints && (
          <ul
            className={hasVisual ? 'flex-shrink-0 space-y-3' : 'space-y-3.5 mx-auto'}
            style={{ width: hasVisual ? 'clamp(260px, 27vw, 400px)' : undefined, maxWidth: hasVisual ? undefined : 640 }}
          >
            {step.points!.map((p) => (
              <li
                key={p} className="flex items-start gap-2.5 leading-snug"
                style={{ color: P.fg, fontSize: hasVisual ? 'clamp(0.9rem, 1.15vw, 1.05rem)' : 'clamp(1rem, 1.45vw, 1.2rem)' }}
              >
                <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: acc }} />
                {p}
              </li>
            ))}
          </ul>
        )}
        {hasVisual && <FitVisual>{step.visual}</FitVisual>}
        {!hasPoints && !hasVisual && (
          <p className="text-center leading-relaxed mx-auto" style={{ color: P.fg, fontSize: 'clamp(1.15rem, 1.9vw, 1.6rem)', maxWidth: '44ch', textWrap: 'pretty' }}>
            {step.body}
          </p>
        )}
      </motion.div>

      {/* Kernsatz-Banner (aus der PPT-Vorlage) */}
      {step.kernsatz && (
        <motion.div
          variants={itemV}
          className="flex-shrink-0 rounded-lg px-6 py-2.5 text-center font-semibold leading-snug"
          style={{
            background: light ? `${meta.accent}0d` : `${meta.accent}24`,
            border: `1px solid ${acc}3a`,
            color: P.fg,
            fontSize: 'clamp(0.9rem, 1.15vw, 1.05rem)',
          }}
        >
          {step.kernsatz}
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Visual maßvoll auf die Fläche skalieren ──
// Misst die Naturgröße (offsetWidth/-Height sind zoom-unabhängig) und wählt
// den Zoom so, dass Breite UND Höhe passen. Obergrenze bewusst moderat,
// damit kleine Chip-Grafiken nicht riesig werden und alles ähnlich groß wirkt.
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
      const z = Math.min(outer.clientWidth / w, outer.clientHeight / h) * 0.94
      setZoom(Math.max(0.5, Math.min(1.22, z)))
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
    <div ref={outerRef} className="flex-1 h-full min-h-0 min-w-0 flex items-center justify-center overflow-hidden">
      <div ref={innerRef} className="inline-block" style={{ zoom }}>
        {children}
      </div>
    </div>
  )
}

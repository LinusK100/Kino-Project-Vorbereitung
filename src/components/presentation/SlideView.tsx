// Eine Folie im Präsentations-Layout nach PPT-Vorbild: Titel links oben mit
// Akzentlinie, Lead-Satz darunter, das Visual füllt die restliche Fläche
// (automatisch skaliert — Smart-Board-tauglich), Kernsatz-Banner unten.
// Wird vom PresentationHost UND von der Druck-Route verwendet, damit
// Präsentation und PDF identisch aussehen.
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
        hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: EASE, when: 'beforeChildren' as const, staggerChildren: 0.07, delayChildren: 0.03 } },
        exit: { opacity: 0, y: -18, filter: 'blur(6px)', transition: { duration: 0.22, ease: 'easeIn' as const } },
      }
  const itemV = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE } } }

  // ── Titelfolie: zentriert, groß ──
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
          variants={itemV} className="font-bold leading-none mb-7"
          style={{ fontFamily: 'var(--font-display)', color: P.fg, fontSize: 'clamp(3.4rem, 10vw, 7rem)', textWrap: 'balance' }}
        >
          {step.title}
        </motion.h2>
        <motion.div variants={itemV} className="rounded-full mb-7" style={{ width: 130, height: 6, background: acc }} />
        <motion.p variants={itemV} className="leading-relaxed" style={{ color: P.fgSoft, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', maxWidth: 720, textWrap: 'pretty' }}>
          {step.body}
        </motion.p>
      </motion.div>
    )
  }

  // ── Inhaltsfolie: Kopf links, Fläche fürs Visual, Kernsatz unten ──
  return (
    <motion.div
      variants={slideV} initial="hidden" animate="show" exit="exit"
      className="h-full w-full flex flex-col text-left"
      style={{ willChange: 'transform, opacity, filter' }}
    >
      <motion.div variants={itemV} className="flex-shrink-0">
        <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.26em] mb-1.5" style={{ color: acc }}>
          {meta.label}
        </p>
        <h2
          className="font-bold leading-[1.08] mb-2.5"
          style={{
            fontFamily: 'var(--font-display)', color: P.fg, textWrap: 'balance',
            fontSize: step.visual ? 'clamp(1.7rem, 3vw, 2.7rem)' : 'clamp(1.9rem, 3.4vw, 3rem)',
          }}
        >
          {step.title}
        </h2>
        <div className="rounded-full mb-3" style={{ width: 68, height: 4, background: acc }} />
        {step.visual && (
          <p className="leading-relaxed" style={{ color: P.fgSoft, fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)', maxWidth: '100ch', textWrap: 'pretty' }}>
            {step.body}
          </p>
        )}
      </motion.div>

      <motion.div variants={itemV} className="flex-1 min-h-0 flex flex-col items-center justify-center py-3">
        {step.visual
          ? <FitVisual>{step.visual}</FitVisual>
          : (
            <p className="text-center leading-relaxed mx-auto" style={{ color: P.fg, fontSize: 'clamp(1.25rem, 2.1vw, 1.8rem)', maxWidth: '42ch', textWrap: 'pretty' }}>
              {step.body}
            </p>
          )}
        {step.points && (
          <ul className="mt-6 space-y-2.5 text-left mx-auto" style={{ maxWidth: 640 }}>
            {step.points.map((p) => (
              <li key={p} className="flex items-start gap-3" style={{ color: P.fg, fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>
                <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: acc, boxShadow: light ? undefined : `0 0 8px ${acc}` }} />
                {p}
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {step.kernsatz && (
        <motion.div
          variants={itemV}
          className="flex-shrink-0 rounded-xl px-6 py-3 text-center font-semibold leading-snug"
          style={{
            background: light ? `${meta.accent}0e` : `${meta.accent}26`,
            border: `1px solid ${acc}44`,
            color: P.fg,
            fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
          }}
        >
          {step.kernsatz}
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Visual auf die verfügbare Fläche skalieren (Smart Board / Druck) ──
// Misst die Naturgröße des Visuals (offsetWidth/-Height sind zoom-unabhängig)
// und wählt den Zoom so, dass Breite UND Höhe hineinpassen.
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
      const z = Math.min(outer.clientWidth / w, outer.clientHeight / h) * 0.96
      setZoom(Math.max(0.55, Math.min(1.6, z)))
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
      <div ref={innerRef} className="inline-block" style={{ zoom }}>
        {children}
      </div>
    </div>
  )
}

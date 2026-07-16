// Druck-Ansicht der Gesamt-Präsentation: alle Folien gestapelt, eine je Seite
// (16:9, 297×167 mm), immer hell, ohne Animationen. Nutzt dieselbe SlideView
// wie der Präsentationsmodus — PDF und Vortrag sehen identisch aus.
// Aus dieser Route erzeugt scripts/export-praesentation.mjs das PDF.
import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { useAppStore } from '@/store/appStore'
import { useGesamt, SECTION_META, type GesamtSlide } from '@/components/presentation/steps'
import { Timeline } from '@/components/presentation/PresentationHost'
import { SlideView } from '@/components/presentation/SlideView'
import { pres } from '@/components/presentation/visuals/core'

export default function PraesentationDruckPage() {
  const deck = useGesamt()
  const setTheme = useAppStore((s) => s.setTheme)

  // Druck ist immer hell — Präsentations-Theme und Website-Theme festnageln,
  // damit pres()/bright() die Hell-Palette liefern.
  useEffect(() => {
    useAppStore.setState({ presTheme: 'light' })
    setTheme('light')
    document.title = 'CineTicket — Systemanalyse und Entwurf (Präsentation)'
  }, [setTheme])

  return (
    <MotionConfig reducedMotion="always">
      <div style={{ background: '#fff' }}>
        {deck.map((step, i) => (
          <DruckSeite key={step.id} step={step} index={i} deck={deck} />
        ))}
      </div>
    </MotionConfig>
  )
}

function DruckSeite({ step, index, deck }: { step: GesamtSlide; index: number; deck: GesamtSlide[] }) {
  const meta = SECTION_META[step.abschnitt] ?? SECTION_META.start
  const P = pres()
  const total = deck.length

  return (
    <section
      style={{
        width: '297mm', height: '167mm',
        pageBreakAfter: index < total - 1 ? 'always' : undefined,
        position: 'relative', overflow: 'hidden',
        background: `radial-gradient(120% 70% at 50% 0%, ${meta.accent}0c 0%, transparent 55%), #ffffff`,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Kopf */}
      <div className="flex items-center justify-between px-10 pt-5 pb-1 text-[11px]" style={{ color: P.fgFaint }}>
        <span className="font-bold uppercase tracking-[0.18em]">CineTicket — Systemanalyse und Entwurf</span>
        <span className="font-mono">{index + 1} / {total}</span>
      </div>

      {/* Folie — identisches Layout wie im Präsentationsmodus */}
      <div className="flex-1 min-h-0 px-12 pb-2">
        <SlideView step={step} />
      </div>

      {/* Fuß: Abschnitts-Timeline wie im Präsentationsmodus */}
      <div className="flex justify-center pb-5 px-10">
        <Timeline deck={deck} index={index} onJump={() => {}} light />
      </div>
    </section>
  )
}

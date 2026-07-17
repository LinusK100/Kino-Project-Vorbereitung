// Druck-Ansicht der Gesamt-Präsentation: alle Folien gestapelt, eine je Seite
// (16:9, 297×167 mm), immer hell, ohne Animationen. Nutzt SlideCard, Kopf- und
// Fußleiste des Präsentationsmodus — jede PDF-Seite sieht exakt aus wie die
// Präsentation auf der Website. Quelle für scripts/export-praesentation.mjs.
import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { useAppStore } from '@/store/appStore'
import { useGesamt, SECTION_META, type GesamtSlide } from '@/components/presentation/steps'
import { PresFootBar, PresHeaderBar } from '@/components/presentation/PresentationHost'
import { SlideCard, SlideView } from '@/components/presentation/SlideView'

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
  const total = deck.length

  return (
    <section
      style={{
        width: '297mm', height: '167mm',
        pageBreakAfter: index < total - 1 ? 'always' : undefined,
        position: 'relative', overflow: 'hidden',
        background: `radial-gradient(120% 80% at 50% 0%, ${meta.accent}14 0%, transparent 55%), linear-gradient(180deg, #eef1f6 0%, #e6eaf1 100%)`,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* identische Kopfleiste wie im Präsentationsmodus */}
      <PresHeaderBar
        light accent={meta.accent}
        titel="CineTicket — Systemanalyse und Entwurf"
        index={index} total={total}
      />

      {/* Folie als Karte — identisches Layout wie im Präsentationsmodus */}
      <div className="relative flex-1 min-h-0 px-5 md:px-10 pt-4 pb-3">
        <SlideCard light accent={meta.accent}>
          <SlideView step={step} />
        </SlideCard>
      </div>

      {/* identische Fußleiste (Zurück · Timeline · Weiter) */}
      <PresFootBar
        deck={deck} index={index} light accent={meta.accent} atEnd={index === total - 1}
      />
    </section>
  )
}

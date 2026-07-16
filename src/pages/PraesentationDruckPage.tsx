// Druck-Ansicht der Gesamt-Präsentation: alle Folien gestapelt, eine je Seite
// (16:9, 297×167 mm), immer hell, ohne Animationen. Aus dieser Route erzeugt
// scripts/export-praesentation.mjs das herunterladbare PDF auf dem Dashboard.
// Bewusst ohne AppShell (eigene Top-Level-Route) und nicht in der Navigation.
import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { useAppStore } from '@/store/appStore'
import { useGesamt, SECTION_META, type GesamtSlide } from '@/components/presentation/steps'
import { Timeline } from '@/components/presentation/PresentationHost'
import { bright, pres } from '@/components/presentation/visuals/core'

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
          <DruckFolie key={step.id} step={step} index={i} deck={deck} />
        ))}
      </div>
    </MotionConfig>
  )
}

function DruckFolie({ step, index, deck }: { step: GesamtSlide; index: number; deck: GesamtSlide[] }) {
  const meta = SECTION_META[step.abschnitt] ?? SECTION_META.start
  const P = pres()
  const acc = bright(meta.accent)
  const titelFolie = step.art === 'titel'
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
      <div className="flex items-center justify-between px-10 pt-6 text-[11px]" style={{ color: P.fgFaint }}>
        <span className="font-bold uppercase tracking-[0.18em]">CineTicket — Systemanalyse und Entwurf</span>
        <span className="font-mono">{index + 1} / {total}</span>
      </div>

      {/* Folie */}
      <div className="flex-1 flex items-center justify-center px-12">
        <div className="text-center" style={{ width: step.visual ? 1040 : 860, maxWidth: '100%' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] mb-3" style={{ color: acc }}>
            {titelFolie ? 'Systemanalyse und Entwurf' : meta.label}
          </p>
          <h2
            className="font-bold mb-4"
            style={{
              fontFamily: 'var(--font-display)', color: P.fg, lineHeight: 1.12,
              fontSize: titelFolie ? 64 : step.visual ? 30 : 42, textWrap: 'balance',
            }}
          >
            {step.title}
          </h2>
          {titelFolie && <div className="mx-auto mb-6 rounded-full" style={{ width: 110, height: 5, background: acc }} />}
          {step.visual && <div className="flex justify-center my-5">{step.visual}</div>}
          <p
            className="mx-auto leading-relaxed"
            style={{
              color: P.fgSoft, maxWidth: step.visual ? 760 : 640,
              fontSize: titelFolie ? 18 : step.visual ? 14 : 16, textWrap: 'pretty',
            }}
          >
            {step.body}
          </p>
          {step.points && (
            <ul className="mx-auto mt-6 space-y-2 text-left" style={{ maxWidth: 560 }}>
              {step.points.map((p) => (
                <li key={p} className="flex items-start gap-3" style={{ color: P.fg, fontSize: 15 }}>
                  <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: acc }} />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {step.kernsatz && (
            <div
              className="mx-auto mt-5 rounded-xl px-5 py-3 text-[13px] font-semibold leading-snug"
              style={{ maxWidth: 760, background: `${meta.accent}0e`, border: `1px solid ${acc}44`, color: P.fg }}
            >
              {step.kernsatz}
            </div>
          )}
        </div>
      </div>

      {/* Fuß: Abschnitts-Timeline wie im Präsentationsmodus */}
      <div className="flex justify-center pb-6 px-10">
        <Timeline deck={deck} index={index} onJump={() => {}} light />
      </div>
    </section>
  )
}

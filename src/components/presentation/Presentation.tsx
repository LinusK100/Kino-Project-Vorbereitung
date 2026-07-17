// Start-Knopf für den Präsentationsmodus. Ein Klick öffnet die Auswahl:
// nur dieser Abschnitt, die Gesamt-Präsentation ab hier oder von vorn — und,
// falls eine frühere Gesamt-Präsentation beendet wurde, das Fortsetzen an
// genau der gemerkten Folie. Abgespielt wird zentral im PresentationHost.
import { useState } from 'react'
import {
  Play, RotateCcw, SkipForward, History, Presentation as PresentationIcon, ChevronRight,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { gesamtStartIndex, useGesamt, SECTION_META } from './steps'

interface PresentationProps {
  section: string          // Abschnitts-Schlüssel (steps.tsx / SECTION_META)
  accent: string
  label?: string
  /** weißer Knopf für farbige Flächen (z. B. Dashboard-Hero) */
  invert?: boolean
  /** Beschriftung der Nur-dieser-Abschnitt-Option (Dashboard: „Website-Tour") */
  sectionLabel?: string
}

export function Presentation({ section, accent, label = 'Präsentation', invert, sectionLabel }: PresentationProps) {
  const [open, setOpen] = useState(false)
  const startPres = useAppStore((s) => s.startPres)
  const presResume = useAppStore((s) => s.presResume)
  const deck = useGesamt()

  const hierIndex = gesamtStartIndex(section)
  const resumeSlide = presResume !== null ? deck[presResume] : undefined
  const resumeLabel = resumeSlide
    ? `${SECTION_META[resumeSlide.abschnitt]?.label ?? ''}, Folie ${presResume! + 1} von ${deck.length}`
    : ''

  const start = (index: number | 'abschnitt') => {
    setOpen(false)
    if (index === 'abschnitt') startPres({ scope: 'abschnitt', section })
    else startPres({ scope: 'gesamt', section: '', index })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Präsentation starten – gesamter Vortrag oder nur dieser Abschnitt"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:-translate-y-0.5 ${invert ? '' : 'text-white'}`}
        style={invert
          ? { background: '#fff', color: accent, boxShadow: '0 2px 12px rgba(0,0,0,0.28)' }
          : { background: accent, boxShadow: `0 2px 10px ${accent}55` }}
      >
        <PresentationIcon size={14} />
        {label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-md rounded-2xl"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <PresentationIcon size={17} style={{ color: accent }} /> Präsentation starten
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-2">
            {resumeSlide && (
              <StartOption
                icon={History} accent={accent}
                title="Fortsetzen"
                desc={`Weiter bei ${resumeLabel}`}
                onClick={() => start(presResume!)}
                primary
              />
            )}
            <StartOption
              icon={RotateCcw} accent={accent}
              title="Gesamte Präsentation — von vorn"
              desc={`Alle Abschnitte als ein Vortrag, ${deck.length} Folien`}
              onClick={() => start(0)}
              primary={!resumeSlide}
            />
            {hierIndex > 0 && (
              <StartOption
                icon={SkipForward} accent={accent}
                title="Gesamte Präsentation — ab hier"
                desc={`Beginnt bei ${SECTION_META[deck[hierIndex]?.abschnitt]?.label ?? 'diesem Abschnitt'} (Folie ${hierIndex + 1})`}
                onClick={() => start(hierIndex)}
              />
            )}
            <StartOption
              icon={Play} accent={accent}
              title={sectionLabel ?? 'Nur diesen Abschnitt'}
              desc={sectionLabel ? 'Die kurze Tour dieses Abschnitts' : 'Die Folien dieses Abschnitts, wie im Gesamtvortrag'}
              onClick={() => start('abschnitt')}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function StartOption({ icon: Icon, accent, title, desc, onClick, primary }: {
  icon: React.ElementType; accent: string; title: string; desc: string; onClick: () => void; primary?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-transform hover:-translate-y-0.5"
      style={{
        background: primary ? `${accent}10` : 'var(--bg-whiteboard)',
        border: `1px solid ${primary ? `${accent}55` : 'var(--border-color)'}`,
      }}
    >
      <span
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}16`, color: accent }}
      >
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</span>
        <span className="block text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</span>
      </span>
      <ChevronRight size={15} className="flex-shrink-0" style={{ color: accent }} />
    </button>
  )
}

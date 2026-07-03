import { useMemo, useState } from 'react'
import { Workflow } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { DiagramFrame } from '@/components/diagram/DiagramFrame'
import { SequenceDiagram } from '@/components/diagram/SequenceDiagram'
import { sequences } from '@/data/content'
import { useAppStore } from '@/store/appStore'
import { FlowUebersicht, SeqAusschnitt } from '@/components/presentation/visuals/flow'
import type { SequenceDiagram as SeqType, PresentationStep, Mode } from '@/types'

const ACCENT = '#7a39bb'

// Einfach: der Happy Path der Online-Buchung. Erweitert vertieft die
// Fehlerpfade (alt-Fragment) und den Storno quer über alle Objekte.
function stepsFor(mode: Mode): PresentationStep[] {
  const happy: PresentationStep[] = [
    {
      id: 'intro', title: 'Vier Flows statt eines Monsters', visual: <FlowUebersicht />,
      body: 'Der Buchungsprozess als Interaktion über die Zeit: Wer schickt wann welche Nachricht an wen? Vier fokussierte Diagramme statt eines überladenen – die nächsten Folien zoomen in die Online-Buchung.',
    },
    {
      id: 'hold', title: 'Der Hold: 10 Minuten verbindlich', visual: <SeqAusschnitt flow="online-buchung" msgSeqs={['6', '7', '8a', '9a']} />,
      body: 'Beim Checkout ruft der BuchungService reservieren() am VorstellungSitz auf – der Sitz wird serverseitig RESERVIERT und ist für parallele Käufer blockiert. Das Badge zeigt den Statuswechsel.',
    },
    {
      id: 'zahlung', title: 'Die Zahlung entscheidet', visual: <SeqAusschnitt flow="online-buchung" msgSeqs={['12', '13a', '14', '15', '16']} />,
      body: 'Erst wenn die Zahlung ERFOLGREICH ist, wird der Sitz BELEGT, die Buchung BESTÄTIGT und das QR-Ticket erzeugt – vier Statuswechsel in genau dieser Reihenfolge.',
    },
  ]
  const vertiefung: PresentationStep[] = [
    {
      id: 'fehler', title: 'Und wenn der Platz weg ist?', visual: <SeqAusschnitt flow="online-buchung" msgSeqs={['8b', '9b', '10b']} frame={{ label: 'alt', guard: '[Platz bereits vergeben]' }} />,
      body: 'Kommt reservieren() zu spät, antwortet der Sitz mit false – der Kunde landet zurück in der Sitzwahl statt in einer Doppelbuchung. Auf der Seite zeigen die alt-/break-Fragmente auch Zahlungsfehler und Hold-Timeout.',
    },
    {
      id: 'storno', title: 'Ein Storno wirkt überall', visual: <SeqAusschnitt flow="storno" msgSeqs={['2', '3', '4', '5']} />,
      body: 'Vier Aufrufe, vier Objekte: Die Buchung wird STORNIERT, das Ticket ungültig, die Zahlung ERSTATTET und der Sitz wieder FREI – ein Vorgang, konsistent über alle Zustandsautomaten.',
    },
  ]
  const lesehilfe: PresentationStep = {
    id: 'lifelines', title: 'Lesehilfe für die Diagramme',
    body: mode === 'einfach'
      ? 'Oben die Teilnehmer: Akteur, «control»-Services, «entity»-Objekte. Die Zeit läuft an den Lebenslinien nach unten, Aktivierungsbalken zeigen, wer gerade arbeitet. Der Erweitert-Modus ergänzt die Fehlerpfade als alt-/break-Fragmente.'
      : 'Oben die Teilnehmer: Akteur, «control»-Services, «entity»-Objekte. Die Zeit läuft an den Lebenslinien nach unten, Aktivierungsbalken zeigen, wer gerade arbeitet. Durchgezogene Pfeile sind Aufrufe, gestrichelte Rückgaben.',
  }
  return mode === 'einfach' ? [...happy, lesehilfe] : [...happy, ...vertiefung, lesehilfe]
}

export default function SequencePage() {
  const { mode } = useAppStore()
  const showFragments = mode === 'erweitert'
  const steps = useMemo(() => stepsFor(mode), [mode])
  const [activeId, setActiveId] = useState(sequences[0].id)
  const diagram = sequences.find((d) => d.id === activeId) ?? sequences[0]

  return (
    <SectionShell
      kicker="Modellierung"
      title="Sequenzdiagramme"
      subtitle={`Buchungs-Flow in ${sequences.length} Diagrammen · ${showFragments ? 'mit Alternativ-/Fehlerpfaden' : 'Happy Path'}`}
      icon={Workflow}
      accent={ACCENT}
      presentation={steps}
      intro={
        <Callout kind="info" title="Lesart">
          Die Zeit läuft <strong>von oben nach unten</strong>. <strong>Einfach</strong> zeigt den
          Happy Path, <strong>Erweitert</strong> zusätzlich die alt-/break-Fragmente mit den
          Fehlerpfaden. Die Pfeil-Notation steht unter dem Diagramm.
        </Callout>
      }
    >
      <div className="flex flex-wrap gap-2 mb-4" data-pres="seq-tabs">
        {sequences.map((d) => {
          const on = d.id === activeId
          return (
            <button key={d.id} onClick={() => setActiveId(d.id)}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold border transition-all"
              style={{ background: on ? ACCENT : 'var(--card-bg)', color: on ? '#fff' : 'var(--text-secondary)', borderColor: on ? ACCENT : 'var(--border-color)' }}>
              {d.title}
            </button>
          )
        })}
      </div>

      <p className="text-sm mb-3 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>{diagram.description}</p>

      <div data-pres="diagram">
        <DiagramFrame minHeight={400} legend={<SeqLegend />} textView={<MessageList diagram={diagram} />} fitOnLoad fitKey={`${activeId}-${showFragments}`}>
          <SequenceDiagram diagram={diagram} showFragments={showFragments} />
        </DiagramFrame>
      </div>

      {diagram.stories && diagram.stories.length > 0 && (
        <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
          <strong>Verknüpfte Stories:</strong> {diagram.stories.join(', ')}
        </p>
      )}
    </SectionShell>
  )
}

function SeqLegend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
      <span className="flex items-center gap-1.5"><span className="w-4 h-0 border-t-2" style={{ borderColor: 'var(--text-primary)' }} /> synchroner Aufruf ▶</span>
      <span className="flex items-center gap-1.5"><span className="w-4 h-0 border-t-2 border-dashed" style={{ borderColor: 'var(--text-primary)' }} /> Rückgabe / «create» ▷</span>
      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#475569' }} /> Akteur</span>
      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#4f46e5' }} /> «control»</span>
      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#7a39bb' }} /> «entity»</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-4 rounded-sm" style={{ border: '1px solid var(--text-secondary)' }} /> Aktivierung</span>
      <span className="flex items-center gap-1.5">「Badge」 = Statuswechsel (→ Zustandsdiagramm)</span>
    </div>
  )
}

function MessageList({ diagram }: { diagram: SeqType }) {
  const name = (id: string) => diagram.participants.find((p) => p.id === id)?.label ?? id
  return (
    <div>
      <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{diagram.title} – Ablauf</h4>
      <ol className="space-y-1">
        {diagram.messages.map((m) => (
          <li key={m.id} className="text-xs flex gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="font-mono flex-shrink-0" style={{ color: 'var(--text-secondary)', width: 28 }}>{m.seq}</span>
            <span><strong>{name(m.from)}</strong> → <strong>{name(m.to)}</strong>: {m.label}{m.stateEffect ? ` 「${m.stateEffect}」` : ''}</span>
          </li>
        ))}
      </ol>
      {diagram.fragments.length > 0 && (
        <div className="mt-3">
          <h5 className="font-semibold text-xs mb-1" style={{ color: 'var(--text-primary)' }}>Fragmente</h5>
          {diagram.fragments.map((f) => (
            <p key={f.id} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              <strong>{f.kind}</strong> {f.label}: {f.operands.map((o) => `[${o.guard}]`).join(' / ')}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

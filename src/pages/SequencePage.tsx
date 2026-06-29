import { useState } from 'react'
import { Workflow } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { DiagramFrame } from '@/components/diagram/DiagramFrame'
import { SequenceDiagram } from '@/components/diagram/SequenceDiagram'
import { sequences } from '@/data/content'
import { useAppStore } from '@/store/appStore'
import type { SequenceDiagram as SeqType, PresentationStep } from '@/types'

const ACCENT = '#7a39bb'

const steps: PresentationStep[] = [
  { id: 'intro', title: 'Sequenzdiagramme', body: 'Sequenzdiagramme zeigen den Buchungs-Flow als Interaktion über die Zeit: wer schickt wann welche Nachricht an wen. Die Zeit läuft von oben nach unten.', target: '[data-pres="section-header"]' },
  { id: 'tabs', title: 'Vier Flows', body: 'Der Buchungsprozess ist in vier übersichtliche Diagramme geteilt: Online-Buchung, Kassenverkauf, Storno und Einlass. So bleibt jedes einzelne klar.', target: '[data-pres="seq-tabs"]' },
  { id: 'lifelines', title: 'Teilnehmer & Lebenslinien', body: 'Oben die Teilnehmer (Akteur, «control»-Services, «entity»-Objekte), darunter ihre gestrichelten Lebenslinien. Pfeile sind Nachrichten in seq-Reihenfolge.', target: '[data-pres="diagram"]', mode: 'einfach' },
  { id: 'badges', title: 'Statuswechsel-Badges', body: 'Die farbigen 「…」-Badges zeigen, wie eine Nachricht den Objekt-Status ändert – die Brücke zu den Zustandsdiagrammen (z. B. FREI→RESERVIERT).', target: '[data-pres="diagram"]', mode: 'einfach' },
  { id: 'fragments', title: 'Erweitert: Alt-/Break-Pfade', body: 'Im Erweitert-Modus erscheinen die kombinierten Fragmente (alt/opt/break) mit ihren Bedingungen – z. B. „Sitz vergeben" oder „Zahlung fehlgeschlagen".', target: '[data-pres="diagram"]', mode: 'erweitert' },
]

export default function SequencePage() {
  const { mode } = useAppStore()
  const showFragments = mode === 'erweitert'
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
          Zeit läuft <strong>von oben nach unten</strong>. Durchgezogener Pfeil = synchroner Aufruf,
          gestrichelt = Rückgabe/«create». <strong>Einfach</strong> zeigt den Happy Path,
          <strong> Erweitert</strong> zusätzlich die alt-/break-Fragmente.
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

import { useMemo, useState } from 'react'
import { CircleDot, Link2 } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { DiagramFrame } from '@/components/diagram/DiagramFrame'
import { StateDiagram } from '@/components/diagram/StateDiagram'
import { stateMachines } from '@/data/content'
import { extraMachines } from '@/data/statesExtra'
import { useAppStore } from '@/store/appStore'
import type { StateMachine, PresentationStep } from '@/types'

const ACCENT = '#7a39bb'

const steps: PresentationStep[] = [
  { id: 'intro', title: 'Zustandsdiagramme', body: 'Ein Zustandsautomat beschreibt den Lebenszyklus genau eines Objekts: welche Zustände es annimmt und welche Ereignisse mit welchen Guards die Übergänge auslösen.' },
  { id: 'sitz', title: 'Der Sitz je Vorstellung', body: 'FREI → AUSGEWÄHLT → RESERVIERT → BELEGT: Der serverseitige RESERVIERT-Hold blockiert parallele Käufer und verhindert Doppelbuchungen. DEFEKT sperrt den Sitz systemweit.' },
  { id: 'tabs', title: 'Gekoppelte Automaten', body: 'Sitz und Ticket hängen zusammen – ein Ticket entsteht erst, wenn der Sitz BELEGT wird. Ein Storno wirkt überall zugleich: Ticket → STORNIERT, Zahlung → ERSTATTET, Sitz → wieder FREI.' },
  { id: 'enums', title: 'Exakt wie im Klassendiagramm', body: 'Jeder Automat entspricht einem Status-Enum des Klassendiagramms – wertgleich mit Sitzstatus und Ticketstatus. Der Erweitert-Modus ergänzt Buchung und Zahlung als eigene Automaten.' },
]

export default function StatePage() {
  const { mode } = useAppStore()
  const machines: StateMachine[] = useMemo(
    () => (mode === 'einfach' ? stateMachines.machines : [...stateMachines.machines, ...extraMachines]),
    [mode],
  )
  const [activeId, setActiveId] = useState(machines[0].id)
  // derive a valid id (active machine may disappear when switching mode)
  const effId = machines.some((m) => m.id === activeId) ? activeId : machines[0].id
  const machine = machines.find((m) => m.id === effId) ?? machines[0]

  return (
    <SectionShell
      kicker="Modellierung"
      title="Zustandsdiagramme"
      subtitle={`${machines.length} Automaten · Lebenszyklen der zentralen Objekte`}
      icon={CircleDot}
      accent={ACCENT}
      presentation={steps}
      intro={
        <Callout kind="info" title="Notation">
          UML-Zustandsdiagramm: abgerundete Rechtecke = Zustände, <strong>●</strong> = Start,
          <strong> ◎</strong> = Ende. Kantenbeschriftung: <code>event [guard]</code>. Ein Objekt über die Zeit.
        </Callout>
      }
    >
      {/* machine tabs */}
      <div className="flex flex-wrap gap-2 mb-4" data-pres="machine-tabs">
        {machines.map((m) => {
          const on = m.id === effId
          return (
            <button key={m.id} onClick={() => setActiveId(m.id)}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold border transition-all text-left"
              style={{ background: on ? ACCENT : 'var(--card-bg)', color: on ? '#fff' : 'var(--text-secondary)', borderColor: on ? ACCENT : 'var(--border-color)' }}>
              <div>{m.title}</div>
              <div className="text-[10px] font-mono opacity-80">{m.statusEnum}</div>
            </button>
          )
        })}
      </div>

      <p className="text-sm mb-3 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>{machine.description}</p>

      <div data-pres="diagram">
        <DiagramFrame
          minHeight={360}
          legend={<StateLegend machine={machine} />}
          textView={<TransitionTable machine={machine} />}
          fitOnLoad
          fitKey={machine.id}
        >
          <StateDiagram machine={machine} />
        </DiagramFrame>
      </div>

      {/* State details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {machine.states.filter((s) => s.kind !== 'initial' && !s.id.startsWith('_')).map((s) => (
          <div key={s.id} className="rounded-xl p-3.5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{s.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--border-color)', color: 'var(--text-secondary)' }}>{s.id}</span>
              {s.kind === 'final' && <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Endzustand</span>}
            </div>
            {s.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.description}</p>}
            {s.relations && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {Object.entries(s.relations).map(([k, v]) => (
                  <span key={k} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-whiteboard)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                    <strong>{k}:</strong> {v}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cross-links */}
      <div className="mt-5" data-pres="crosslinks">
        <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
          <Link2 size={15} style={{ color: ACCENT }} /> Kopplung der Automaten
        </h3>
        <div className="space-y-2">
          {stateMachines.crossLinks.map((x) => (
            <div key={x.id} className="rounded-xl p-3" style={{ background: `${ACCENT}0a`, border: `1px solid ${ACCENT}26` }}>
              <p className="text-xs font-mono font-semibold mb-0.5" style={{ color: ACCENT }}>{x.trigger}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{x.effect}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

function StateLegend({ machine }: { machine: StateMachine }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {machine.states.filter((s) => s.kind !== 'initial' && !s.id.startsWith('_')).map((s) => (
        <div key={s.id} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="w-3 h-3 rounded" style={{ background: s.color }} />{s.label}
        </div>
      ))}
    </div>
  )
}

function TransitionTable({ machine }: { machine: StateMachine }) {
  return (
    <div>
      <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{machine.title} – Übergänge</h4>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{ color: 'var(--text-secondary)' }}>
            <th className="text-left py-1 pr-3">Von</th><th className="text-left py-1 pr-3">Nach</th>
            <th className="text-left py-1 pr-3">Ereignis [Guard]</th><th className="text-left py-1 pr-3">Aktion</th><th className="text-left py-1">Akteur</th>
          </tr>
        </thead>
        <tbody>
          {machine.transitions.map((t) => (
            <tr key={t.id} style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <td className="py-1 pr-3 font-mono">{t.from === '_initial' ? '● Start' : t.from}</td>
              <td className="py-1 pr-3 font-mono">{t.to}</td>
              <td className="py-1 pr-3">{t.event}{t.guard ? ` [${t.guard}]` : ''}</td>
              <td className="py-1 pr-3" style={{ color: 'var(--text-secondary)' }}>{t.action ?? '—'}</td>
              <td className="py-1" style={{ color: 'var(--text-secondary)' }}>{t.actor ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

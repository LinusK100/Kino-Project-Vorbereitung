import { useMemo, useState } from 'react'
import { GitCompareArrows, CheckCircle2, Map as MapIcon } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { traceability, personaByName } from '@/data/content'
import { useAppStore } from '@/store/appStore'
import type { PresentationStep } from '@/types'

const ACCENT = '#437a22'
const releaseColor: Record<number, string> = { 1: '#437a22', 2: '#d19900', 3: '#a13544' }
const prioColor: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }

const steps: PresentationStep[] = [
  { id: 'intro', title: 'Traceability-Matrix', body: 'Die Matrix verbindet alle Ebenen: jede User Story verweist auf ihre Persona, Aktivität, ihr Release und die umgesetzten UML-Klassen. So ist Konsistenz nachweisbar.', target: '[data-pres="section-header"]' },
  { id: 'stats', title: 'Modell ⊇ Prototyp', body: 'Von 51 Stories sind 20 im Prototyp umgesetzt, 31 sind als Roadmap modelliert. Das Flag macht die Differenz zwischen Modell und Prototyp explizit.', target: '[data-pres="stats"]' },
  { id: 'row', title: 'Eine Zeile = eine Spur', body: 'Jede Zeile verfolgt eine Story von der Persona über die Aktivität bis zu den konkreten UML-Klassen – lückenlos.', target: '[data-pres="table"]' },
  { id: 'filter', title: 'Implementiert vs. Roadmap', body: 'Filtere nach Umsetzungsstand, um zu sehen, was der Prototyp heute kann und was modelliert, aber noch offen ist.', target: '[data-pres="filters"]' },
]

export default function TraceabilityPage() {
  const { mode } = useAppStore()
  const [filter, setFilter] = useState<'all' | 'implementiert' | 'roadmap'>('all')

  const base = mode === 'einfach' ? traceability.entries.filter((e) => e.prototyp === 'implementiert') : traceability.entries
  const rows = useMemo(() => filter === 'all' ? base : base.filter((e) => e.prototyp === filter), [base, filter])

  const implemented = base.filter((e) => e.prototyp === 'implementiert').length

  return (
    <SectionShell
      kicker="Synthese"
      title="Traceability"
      subtitle={`${base.length} Stories nachverfolgt · ${implemented} im Prototyp umgesetzt`}
      icon={GitCompareArrows}
      accent={ACCENT}
      presentation={steps}
      intro={
        <Callout kind="info" title="Nachweisbar konsistent">
          Story ↔ Persona ↔ Aktivität ↔ Release ↔ UML-Klassen ↔ Prototyp-Status. Die Matrix beweist, dass alle
          Abschnitte aufeinander abgestimmt sind – kein loses Ende.
        </Callout>
      }
    >
      {/* stats */}
      <div className="grid grid-cols-3 gap-3 mb-4" data-pres="stats">
        <Stat label="Stories" value={traceability.stats.stories} color={ACCENT} />
        <Stat label="Implementiert" value={traceability.stats.implementiert} color="#006494" />
        <Stat label="Roadmap" value={traceability.stats.roadmap} color="#d19900" />
      </div>

      {/* filters */}
      <div className="flex gap-2 mb-4" data-pres="filters">
        {(['all', 'implementiert', 'roadmap'] as const).map((f) => {
          const on = filter === f
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize"
              style={{ background: on ? ACCENT : 'var(--card-bg)', color: on ? '#fff' : 'var(--text-secondary)', borderColor: on ? ACCENT : 'var(--border-color)' }}>
              {f === 'all' ? 'Alle' : f}
            </button>
          )
        })}
        <span className="ml-auto text-xs self-center" style={{ color: 'var(--text-secondary)' }}>{rows.length} Zeilen</span>
      </div>

      <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--border-color)' }} data-pres="table">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr style={{ background: 'var(--bg-whiteboard)' }}>
              {['ID', 'Story', 'Persona', 'Aktivität', 'Rel.', 'Prototyp', 'UML-Klassen'].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const p = personaByName[e.personaErweitert]
              return (
                <tr key={e.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td className="px-3 py-2 font-mono text-xs font-bold" style={{ color: ACCENT }}>{e.id}</td>
                  <td className="px-3 py-2 text-xs" style={{ color: 'var(--text-primary)' }}>{e.title}</td>
                  <td className="px-3 py-2">
                    {p && <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: p.color }}>{p.avatar}</span>
                      {p.name.split(' ')[0]}
                    </span>}
                  </td>
                  <td className="px-3 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{e.activity}</td>
                  <td className="px-3 py-2"><span className="text-xs font-bold" style={{ color: releaseColor[e.release] }}>R{e.release}</span></td>
                  <td className="px-3 py-2">
                    {e.prototyp === 'implementiert' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#006494' }}><CheckCircle2 size={13} /> live</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#d19900' }}><MapIcon size={13} /> Roadmap</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {e.umlClasses.slice(0, 4).map((c) => <span key={c} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-whiteboard)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>{c}</span>)}
                      {e.umlClasses.length > 4 && <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>+{e.umlClasses.length - 4}</span>}
                    </div>
                  </td>
                  <td className="px-1"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: prioColor[e.priority] }} title={e.priority} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </SectionShell>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  )
}

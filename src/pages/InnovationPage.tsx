import { useState } from 'react'
import {
  Sparkles, TrendingUp, ShieldCheck, ScanEye, Accessibility, LineChart, ChevronDown,
} from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { innovation, personaById } from '@/data/content'
import { usePresentation } from '@/components/presentation/steps'
import type { Innovation } from '@/types'

const ACCENT = '#437a22'

const iconMap: Record<string, React.ElementType> = {
  'trending-up': TrendingUp, 'shield-check': ShieldCheck, sparkles: Sparkles,
  'scan-eye': ScanEye, accessibility: Accessibility, 'line-chart': LineChart,
}

const feasCfg: Record<string, { label: string; color: string }> = {
  machbar: { label: 'Im Rahmen machbar', color: '#437a22' },
  teilweise: { label: 'Teilweise machbar', color: '#d19900' },
  konzept: { label: 'Konzept / Vision', color: '#7a39bb' },
}

// Dieser Abschnitt kennt bewusst keinen Einfach/Erweitert-Modus:
// alle Ideen werden immer gezeigt. Folien-Texte: src/data/presentations/innovation.json
export default function InnovationPage() {
  const items = innovation.innovations
  const steps = usePresentation('innovation')

  return (
    <SectionShell
      kicker="Ergebnis"
      title="Innovation"
      subtitle={`${items.length} recherchierte Zukunfts-Ideen (2026)`}
      icon={Sparkles}
      accent={ACCENT}
      modes={false}
      presentation={steps}
      help={
        <div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Ideen für die Zeit nach dem MVP. Jede ist ehrlich eingeordnet – umsetzbar, teilweise
            umsetzbar oder als Konzept:
          </p>
          <div className="flex flex-wrap gap-2" data-pres="legend">
            {Object.entries(feasCfg).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${v.color}14`, color: v.color, border: `1px solid ${v.color}40` }}>
                <span className="w-2 h-2 rounded-full" style={{ background: v.color }} />{v.label}
              </span>
            ))}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-pres="grid">
        {items.map((it, i) => <Card key={it.id} item={it} presAttr={i === 0 ? 'first-card' : undefined} />)}
      </div>
    </SectionShell>
  )
}

function Card({ item, presAttr }: { item: Innovation; presAttr?: string }) {
  const [open, setOpen] = useState(false)
  const Icon = iconMap[item.icon] ?? Sparkles
  const feas = feasCfg[item.feasibility]
  const persona = personaById[item.persona]

  return (
    <article className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }} data-pres={presAttr}>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}15`, color: ACCENT }}>
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.personaLabel}</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: `${feas.color}18`, color: feas.color, border: `1px solid ${feas.color}40` }}>
            {feas.label}
          </span>
        </div>

        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{item.summary}</p>

        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          {item.stories.map((s) => <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-whiteboard)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>{s}</span>)}
          {persona && <span className="text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: `${persona.color}18`, color: persona.color }}>{persona.avatar}</span>}
          <span className="ml-auto text-[10px]" style={{ color: 'var(--text-secondary)' }}>Impact {item.impact}/5 · Aufwand {item.effort}/5</span>
        </div>
      </div>

      <button onClick={() => setOpen((o) => !o)} className="mt-auto px-4 py-2.5 flex items-center justify-between text-xs font-semibold border-t" style={{ borderColor: 'var(--border-color)', color: ACCENT }}>
        Details & Modell-Bezug
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </button>
      {open && (
        <div className="px-4 py-3 text-xs leading-relaxed" style={{ background: 'var(--bg-whiteboard)', color: 'var(--text-secondary)' }}>
          <p className="mb-2">{item.detail}</p>
          <p className="mb-2"><strong style={{ color: 'var(--text-primary)' }}>Hinweis:</strong> {item.note}</p>
          <p><strong style={{ color: 'var(--text-primary)' }}>UML-Klassen:</strong> {item.umlClasses.join(', ')}</p>
        </div>
      )}
    </article>
  )
}

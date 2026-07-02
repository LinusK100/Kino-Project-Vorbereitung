import { useState } from 'react'
import {
  Sparkles, TrendingUp, ShieldCheck, ScanEye, Accessibility, LineChart, ChevronDown,
} from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { innovation, personaById } from '@/data/content'
import { useAppStore } from '@/store/appStore'
import type { Innovation, PresentationStep } from '@/types'

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

const steps: PresentationStep[] = [
  { id: 'intro', title: 'Innovation', body: 'Recherchierte Zukunfts-Ideen (2026) über den MVP hinaus – jede in User Stories und UML-Klassen verankert. Keine losen Visionen, sondern integrierte Erweiterungen des Modells.' },
  {
    id: 'feas', title: 'Ehrliche Machbarkeit', body: 'Jede Idee trägt ein begründetes Flag:',
    points: [
      'machbar – im Projektrahmen umsetzbar (z. B. dynamische Preise, DSGVO)',
      'teilweise – Kern machbar, voller Umfang braucht Zusatzsysteme',
      'Konzept – bewusst als Vision markiert (AR-Hardware, ML-Modelle)',
    ],
  },
  { id: 'cards', title: 'Verankert im Modell', body: 'KI-Sitzempfehlung, AR-Facility oder Auslastungsprognose: Jede Idee nennt Persona, Stories und die betroffenen UML-Klassen – und bleibt ehrlich, wenn die Technik den Projektrahmen sprengt.' },
]

export default function InnovationPage() {
  const { mode } = useAppStore()
  const items = mode === 'einfach' ? innovation.innovations.filter((i) => i.tier === 'basis') : innovation.innovations

  return (
    <SectionShell
      kicker="Ergebnis"
      title="Innovation"
      subtitle="Recherchierte Zukunfts-Ideen (2026)"
      icon={Sparkles}
      accent={ACCENT}
      presentation={steps}
      intro={
        <div className="space-y-3">
          <Callout kind="idea">
            Ideen über den MVP hinaus – jede mit Persona, Stories und UML-Klassen verknüpft und als
            umsetzbar bzw. Konzept gekennzeichnet.
          </Callout>
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

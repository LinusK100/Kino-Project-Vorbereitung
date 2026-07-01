import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Layers, Layers3, Presentation as PresentationIcon, Moon,
  ArrowRight, Users, ListChecks, Boxes, Film,
} from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { NAV } from '@/components/layout/nav'
import { personas, stories, uml, sequences, stateMachines } from '@/data/content'
import { extraMachines } from '@/data/statesExtra'
import type { PresentationStep } from '@/types'

const ACCENT = '#01696f'

const kpis = [
  { label: 'Personas', value: `${personas.basis.length}–${personas.erweitert.length}`, icon: Users },
  { label: 'User Stories', value: `${stories.basis.length}–${stories.erweitert.length}`, icon: ListChecks },
  { label: 'UML-Klassen', value: uml.classes.length, icon: Boxes },
  // Klassendiagramm + Sequenzdiagramme + Zustandsautomaten (inkl. Enum-Automaten)
  { label: 'Diagramme', value: 1 + sequences.length + stateMachines.machines.length + extraMachines.length, icon: PresentationIcon },
]

const steps: PresentationStep[] = [
  { id: 'welcome', title: 'Willkommen', body: 'Diese Website dokumentiert das Kino-Projekt CineTicket – von den Anforderungen bis zum Prototyp. Diese kurze Tour erklärt die Bedienung.', target: '[data-pres="hero"]' },
  { id: 'aufbau', title: 'Aufbau', body: 'Links sind die Abschnitte gruppiert: Anforderungen, Modellierung und Ergebnis. Du arbeitest sie der Reihe nach durch.', target: '[data-pres="structure"]' },
  { id: 'modi', title: 'Einfach & Erweitert', body: 'Jeder Abschnitt hat zwei Detailgrade: Einfach (MVP) und Erweitert (Vollausbau). Umschalten oben rechts in jedem Abschnitt.', target: '[data-pres="how-modes"]' },
  { id: 'praesentation', title: 'Präsentationsmodus', body: 'Jeder Abschnitt hat eine geführte Präsentation wie diese – mit den Pfeilen weiter oder „Auto". Esc beendet.', target: '[data-pres="how-present"]' },
]

export default function OverviewPage() {
  return (
    <SectionShell
      kicker="Start"
      title="Dashboard"
      subtitle="Aufbau und Bedienung der Website"
      icon={LayoutDashboard}
      accent={ACCENT}
      modes={false}
      presentation={steps}
      intro={
        <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #01696f 0%, #006494 100%)' }} data-pres="hero">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Systemanalyse & Entwurf</p>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>CineTicket – ein Kino-Ticketsystem</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Personas → User Stories → Story Map → UML-Diagramme → Prototyp. Für die Bedienung die Tour oben rechts starten.
            </p>
          </div>
          <Film size={130} color="white" className="absolute -right-4 -bottom-6 opacity-10 hidden md:block" />
        </div>
      }
    >
      {/* How to use */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <HowCard icon={Layers} title="Einfach & Erweitert" accent="#006494" pres="how-modes">
          Zwei Detailgrade je Abschnitt: <Layers3 size={12} className="inline" /> Erweitert zeigt den Vollausbau. Umschalten oben rechts in jedem Abschnitt.
        </HowCard>
        <HowCard icon={PresentationIcon} title="Präsentation" accent="#7a39bb" pres="how-present">
          Geführte Tour je Abschnitt – mit den Pfeilen oder „Auto" durchgehen.
        </HowCard>
        <HowCard icon={Moon} title="Navigation & Theme" accent="#964219">
          Abschnitte links, Hell/Dunkel oben rechts. Diagramme sind zoom- und klickbar.
        </HowCard>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div key={k.label} className="rounded-xl p-3.5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <Icon size={16} style={{ color: ACCENT }} className="mb-2" />
              <div className="text-xl font-bold" style={{ color: ACCENT }}>{k.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{k.label}</div>
            </div>
          )
        })}
      </div>

      {/* Structure */}
      <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Abschnitte</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3" data-pres="structure">
        {NAV.filter((g) => g.title !== 'Start').map((group) => (
          <div key={group.title} className="rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: group.items[0].accent }}>{group.title}</h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.path} to={item.path} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg group transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]" style={{ color: 'var(--text-primary)' }}>
                    <Icon size={16} style={{ color: item.accent }} />
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: item.accent }} />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

function HowCard({ icon: Icon, title, accent, children, pres }: { icon: React.ElementType; title: string; accent: string; children: React.ReactNode; pres?: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }} data-pres={pres}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}18`, color: accent }}><Icon size={16} /></div>
        <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h4>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</p>
    </div>
  )
}

import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Layers, Layers3, Presentation as PresentationIcon, Moon,
  ArrowRight, Users, ListChecks, Boxes, GitCompareArrows, Film,
} from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { NAV } from '@/components/layout/nav'
import { cardVariants, containerVariants } from '@/lib/transitions'
import { personas, stories, uml, sequences, stateMachines, innovation } from '@/data/content'
import type { PresentationStep } from '@/types'

const ACCENT = '#01696f'

const kpis = [
  { label: 'Personas', value: `${personas.basis.length}–${personas.erweitert.length}`, icon: Users, color: '#006494' },
  { label: 'User Stories', value: `${stories.basis.length}–${stories.erweitert.length}`, icon: ListChecks, color: '#006494' },
  { label: 'UML-Klassen', value: uml.classes.length, icon: Boxes, color: '#7a39bb' },
  { label: 'Sequenz-Flows', value: sequences.length, icon: GitCompareArrows, color: '#7a39bb' },
  { label: 'Zustandsautomaten', value: `${stateMachines.machines.length}–4`, icon: Layers, color: '#7a39bb' },
  { label: 'Innovationen', value: innovation.innovations.length, icon: PresentationIcon, color: '#437a22' },
]

const steps: PresentationStep[] = [
  { id: 'welcome', title: 'Willkommen', body: 'Diese Website dokumentiert das Kino-Projekt CineTicket von der Anforderung bis zum Prototyp. Diese Tour zeigt in 5 Schritten, wie alles aufgebaut ist und wie du es bedienst.', target: '[data-pres="section-header"]' },
  { id: 'aufbau', title: '1 · Aufbau in 4 Gruppen', body: 'Links gliedert sich alles in Anforderungen, Modellierung, Synthese und Produkt. Jede Gruppe hat ein einheitliches Design – gleiche Kategorie, gleiches Aussehen.', target: '[data-pres="structure"]' },
  { id: 'modi', title: '2 · Einfach & Erweitert', body: 'Jeder Abschnitt hat genau zwei Tiefen: Einfach (die Grundlagen, MVP) und Erweitert (die ausführliche Variante). Du schaltest oben rechts in jedem Abschnitt um.', target: '[data-pres="how-modes"]' },
  { id: 'praesentation', title: '3 · Präsentationsmodus', body: 'Jeder Abschnitt bietet eine geführte Präsentation – genau wie diese hier. Durchklicken mit den Pfeilen oder „Auto" für automatischen Ablauf. Mit Esc beenden.', target: '[data-pres="how-present"]' },
  { id: 'start', title: '4 · Leg los', body: 'Starte bei den Personas und folge dem roten Faden bis zum Prototyp. Jeder Abschnitt ist mit den anderen abgestimmt – nachweisbar in der Traceability.', target: '[data-pres="structure"]' },
]

export default function OverviewPage() {
  return (
    <SectionShell
      kicker="Start"
      title="Dashboard"
      subtitle="Wie diese Website aufgebaut ist – und wie du sie bedienst"
      icon={LayoutDashboard}
      accent={ACCENT}
      modes={false}
      presentation={steps}
      intro={
        <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #01696f 0%, #006494 100%)' }}>
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Systemanalyse & Entwurf · Universitätsprojekt</p>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>CineTicket – ein Kino-Ticketsystem entwerfen</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Von den Personas über User Stories, Story Map und UML-Diagramme bis zum interaktiven Prototyp –
              alle Aspekte sind aufeinander abgestimmt. Starte die Tour oben rechts, um die Bedienung kennenzulernen.
            </p>
          </div>
          <Film size={140} color="white" className="absolute -right-4 -bottom-6 opacity-10 hidden md:block" />
        </div>
      }
    >
      {/* How to use */}
      <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>So bedienst du die Website</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-7">
        <HowCard icon={Layers} title="Einfach & Erweitert" accent="#006494" pres="how-modes">
          Jeder Abschnitt hat <strong>zwei Tiefen</strong>. <span className="inline-flex items-center gap-1"><Layers size={12} /> Einfach</span> zeigt die
          Grundlagen (MVP), <span className="inline-flex items-center gap-1"><Layers3 size={12} /> Erweitert</span> die ausführliche Variante. Umschalten oben rechts.
        </HowCard>
        <HowCard icon={PresentationIcon} title="Präsentationsmodus" accent="#7a39bb" pres="how-present">
          Jeder Abschnitt hat eine <strong>geführte Präsentation</strong>. Starte sie oben rechts und klicke dich
          durch (← →) oder lass sie mit <strong>Auto</strong> ablaufen. Wichtige Elemente werden hervorgehoben.
        </HowCard>
        <HowCard icon={Moon} title="Navigation & Theme" accent="#964219">
          Links die Abschnitte in <strong>4 Gruppen</strong>. Oben rechts wechselst du zwischen <strong>Hell und Dunkel</strong>.
          Diagramme lassen sich zoomen und als Text anzeigen.
        </HowCard>
      </div>

      {/* KPIs */}
      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-7" variants={containerVariants} initial="initial" animate="animate">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <motion.div key={k.label} variants={cardVariants} className="rounded-xl p-3.5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <Icon size={16} style={{ color: k.color }} className="mb-2" />
              <div className="text-xl font-bold" style={{ color: k.color }}>{k.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{k.label}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Structure */}
      <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Aufbau der Website</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-pres="structure">
        {NAV.filter((g) => g.title !== 'Start').map((group) => (
          <div key={group.title} className="rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: group.items[0].accent }} />
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: group.items[0].accent }}>{group.title}</h4>
            </div>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.path} to={item.path} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg group transition-colors" style={{ color: 'var(--text-primary)' }}>
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

      <Callout kind="info" title="Roter Faden">
        Die Abschnitte bauen aufeinander auf: <strong>Personas</strong> → <strong>User Stories</strong> →
        <strong> Story Map</strong> → <strong>UML-Diagramme</strong> → <strong>Prototyp</strong>. Das Prinzip
        <em> Basis ⊆ Erweitert</em> und <em>Modell ⊇ Prototyp</em> hält alles konsistent – nachprüfbar in der Traceability.
      </Callout>
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

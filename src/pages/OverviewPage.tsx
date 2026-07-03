import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Layers, Presentation as PresentationIcon, Braces, ArrowRight, Film,
} from 'lucide-react'
import { pageVariants } from '@/lib/transitions'
import { NAV } from '@/components/layout/nav'
import { Presentation } from '@/components/presentation/Presentation'
import { personas, stories, uml, sequences, stateMachines } from '@/data/content'
import { extraMachines } from '@/data/statesExtra'
import { DreiStationen, JsonZuSvg, KennzahlenStrip, TeilmengeModi } from '@/components/presentation/visuals/product'
import type { PresentationStep } from '@/types'

const ACCENT = '#01696f'

// Klassendiagramm + Sequenzdiagramme + Zustandsautomaten (inkl. Enum-Automaten)
const nDiagramme = 1 + sequences.length + stateMachines.machines.length + extraMachines.length

const heroStats = [
  `${personas.basis.length}–${personas.erweitert.length} Personas`,
  `${stories.basis.length}–${stories.erweitert.length} User Stories`,
  `${uml.classes.length} UML-Klassen`,
  `${nDiagramme} Diagramme`,
]

const steps: PresentationStep[] = [
  {
    id: 'welcome', title: 'CineTicket', visual: <KennzahlenStrip />,
    body: 'Die Dokumentation eines Kino-Ticketsystems für „Systemanalyse und Entwurf" – von der Anforderungsanalyse über die UML-Modellierung bis zum klickbaren Prototyp.',
  },
  {
    id: 'aufbau', title: 'Drei Stationen', visual: <DreiStationen />,
    body: 'Die Website folgt dem Weg der Systementwicklung: Aus den Anforderungen entstehen die Modelle, aus den Modellen der Prototyp – jede Station baut auf der vorigen auf.',
  },
  {
    id: 'json', title: 'Alle Inhalte sind JSON-Daten', visual: <JsonZuSvg />,
    body: 'Von den Personas bis zu den Zustandsautomaten liegt jeder Inhalt als strukturierte JSON-Datei vor. Die Diagramme werden daraus live als SVG gerendert – konsistent, interaktiv und jederzeit prüfbar.',
  },
  {
    id: 'modi', title: 'Einfach ⊂ Erweitert', visual: <TeilmengeModi />,
    body: 'Anforderungen und Modellierung haben zwei Detailgrade: Einfach zeigt den MVP-Kern, Erweitert den Vollausbau – die Basis ist immer eine echte Teilmenge. Prototyp und Innovation zeigen immer alles.',
  },
  {
    id: 'praes', title: 'Präsentationsmodus',
    body: 'Jeder Abschnitt erklärt seine wichtigsten Inhalte in einer solchen Kino-Tour – mit echten Ausschnitten aus den Diagrammen. Weiter per Pfeiltasten, automatisch mit einstellbarem Tempo, Esc beendet.',
  },
]

const groupIntro: Record<string, string> = {
  Anforderungen: 'Wer braucht was? Personas, ihre Stories und deren Ordnung nach Nutzerreise und Release.',
  Modellierung: 'Das System als UML: Struktur (Klassen), Abläufe (Sequenzen) und Lebenszyklen (Zustände).',
  Ergebnis: 'Der klickbare Prototyp des MVP – und recherchierte Ideen über ihn hinaus.',
}

export default function OverviewPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Hero — zugleich der Kopf dieser Seite */}
      <div className="rounded-2xl p-6 md:p-7 relative overflow-hidden mb-5" style={{ background: 'linear-gradient(135deg, #01696f 0%, #006494 100%)' }}>
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.72)' }}>Systemanalyse & Entwurf</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            CineTicket – ein Kino-Ticketsystem
          </h1>
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.88)' }}>
            Von der Anforderungsanalyse über die UML-Modelle bis zum klickbaren Prototyp.
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {heroStats.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium text-white" style={{ background: 'rgba(255,255,255,0.16)' }}>{s}</span>
            ))}
            <span className="ml-1">
              <Presentation steps={steps} accent={ACCENT} title="Überblick" label="Tour starten" invert />
            </span>
          </div>
        </div>
        <Film size={130} color="white" className="absolute -right-4 -bottom-6 opacity-10 hidden md:block" />
      </div>

      {/* So liest du diese Website */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <HowCard icon={PresentationIcon} title="Präsentationsmodus" accent="#7a39bb">
          Jeder Abschnitt hat eine animierte Kino-Tour mit seinen wichtigsten Inhalten –
          weiter per Pfeiltasten oder automatisch, Esc beendet.
        </HowCard>
        <HowCard icon={Braces} title="Inhalte als JSON" accent="#006494">
          Alle Inhalte liegen als strukturierte JSON-Daten vor; die Diagramme werden daraus
          live als SVG gerendert und bleiben so konsistent und prüfbar.
        </HowCard>
        <HowCard icon={Layers} title="Einfach & Erweitert" accent="#964219">
          Anforderungen und Modellierung haben zwei Detailgrade: MVP-Kern oder Vollausbau,
          die Basis immer als echte Teilmenge. Prototyp und Innovation zeigen immer alles.
        </HowCard>
      </div>

      {/* Abschnitte, gruppiert entlang des Entwicklungswegs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {NAV.filter((g) => g.title !== 'Start').map((group) => (
          <div key={group.title} className="rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: group.items[0].accent }}>{group.title}</h4>
            <p className="text-xs leading-relaxed mb-2.5" style={{ color: 'var(--text-secondary)' }}>{groupIntro[group.title]}</p>
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
    </motion.div>
  )
}

function HowCard({ icon: Icon, title, accent, children }: { icon: React.ElementType; title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}18`, color: accent }}><Icon size={16} /></div>
        <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h4>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</p>
    </div>
  )
}

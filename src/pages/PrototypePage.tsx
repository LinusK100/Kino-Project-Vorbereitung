import {
  Smartphone, ExternalLink, Rocket, User, CreditCard, LineChart, ScanLine,
  Coffee, Wrench, Building2, ShieldCheck, Users, Boxes, ListChecks, GitBranch,
} from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { useAppStore } from '@/store/appStore'
import { prototype } from '@/data/content'
import { RollenGrid, WizardSchritte } from '@/components/presentation/visuals/product'
import { ImplSplit } from '@/components/presentation/visuals/uml'
import type { PresentationStep } from '@/types'

const ACCENT = '#964219'
// The full interactive Hi-Fi prototype is a separate app; this section is the
// only place that opens an external tab (per project requirement).
const PROTOTYPE_URL = import.meta.env.BASE_URL + 'prototyp-app/'

const roleIcon: Record<string, React.ElementType> = {
  endkunde: User, kasse: CreditCard, manager: LineChart, einlass: ScanLine,
  service: Coffee, facility: Wrench, marke: Building2, admin: ShieldCheck,
}

const protoSteps: PresentationStep[] = [
  { id: 'intro', title: 'Der MVP zum Anfassen', body: 'Release 1 als klickbare Hi-Fi-App: React mit gemockter API (MSW), läuft komplett im Browser ohne Installation. Der Button auf dieser Seite öffnet den Prototyp als eigene App in einem neuen Tab.' },
  {
    id: 'rollen', title: 'Acht Rollen, vier davon live', visual: <RollenGrid />,
    body: 'Endkunde, Kasse, Manager und Einlass sind vollständig klickbar und in der App oben umschaltbar. Die vier übrigen Rollen sind bewusst nur modelliert und als Roadmap ausgewiesen.',
  },
  {
    id: 'wizard', title: 'Der Wizard folgt dem Sequenzdiagramm', visual: <WizardSchritte />,
    body: 'Die fünf Schritte des Buchungs-Wizards entsprechen exakt dem Flow „Online-Buchung": Sitz-Hold beim Sitzplan, Zahlung, dann BELEGT und QR-Ticket. Modell und Prototyp erzählen dieselbe Geschichte.',
  },
  {
    id: 'roadmap', title: 'Modell ⊇ Prototyp', visual: <ImplSplit extras={['4 / 8 Rollen live', '20 Stories abgedeckt']} />,
    body: 'Der Prototyp setzt genau die Hälfte des Modells um – der Rest ist als Roadmap vollständig in UML-Klassen und Stories modelliert. Der Erweitert-Modus dieser Seite zeigt die komplette Liste.',
  },
]

export default function PrototypePage() {
  const { mode } = useAppStore()
  const rollen = mode === 'erweitert' ? prototype.rollen : prototype.rollen.filter((r) => r.status === 'implementiert')
  const wizard = prototype.module.find((m) => m.id === 'buchungs-wizard')
  const { stats, tech } = prototype

  const kpis = [
    { icon: Users, value: `${stats.rollenImplementiert} / ${stats.rollenGesamt}`, label: 'Rollen implementiert' },
    { icon: Boxes, value: stats.umlImplementiert, label: 'UML-Klassen implementiert' },
    { icon: GitBranch, value: stats.umlDesignOnly, label: 'UML-Klassen Design-only' },
    { icon: ListChecks, value: stats.storiesImplementiert, label: 'Stories abgedeckt' },
  ]

  const techChips = [
    tech.framework, tech.build, tech.styling, `${tech.api} (Mock-API)`,
    tech.accessibility, tech.ansicht.join(' + '), `Theme: ${tech.theme.join('/')}`,
  ]

  return (
    <SectionShell
      kicker="Ergebnis"
      title="Prototyp"
      subtitle="Interaktiver Hi-Fi-Prototyp · startet in einem neuen Tab"
      icon={Smartphone}
      accent={ACCENT}
      presentation={protoSteps}
      intro={
        <div className="flex flex-col sm:flex-row sm:items-center gap-3" data-pres="launch">
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm flex-shrink-0 transition-transform hover:-translate-y-0.5"
            style={{ background: ACCENT, boxShadow: `0 4px 16px ${ACCENT}55` }}
          >
            <Rocket size={18} /> Prototyp starten <ExternalLink size={15} />
          </a>
          <Callout kind="info">
            {prototype.beschreibung}
          </Callout>
        </div>
      }
    >
      {/* Kennzahlen (Modell ⊇ Prototyp) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" data-pres="stats">
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

      {/* Rollen */}
      <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {mode === 'erweitert' ? 'Alle acht Rollen' : 'Implementierte Rollen'}
      </h3>
      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
        {mode === 'erweitert'
          ? 'Vier Rollen sind klickbar implementiert, vier weitere modelliert (Roadmap). In der App oben umschaltbar.'
          : 'Diese vier Rollen sind im Prototyp vollständig klickbar – in der App oben umschaltbar.'}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6" data-pres="rollen">
        {rollen.map((r) => {
          const Icon = roleIcon[r.id] ?? User
          const live = r.status === 'implementiert'
          return (
            <div key={r.id} className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}15`, color: ACCENT }}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold" style={{ background: 'var(--border-color)', color: 'var(--text-secondary)' }}>{r.nutzerrolle}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold ml-auto"
                    style={{ background: live ? '#437a2220' : '#d1990020', color: live ? '#437a22' : '#d19900' }}>
                    {live ? 'live' : 'Roadmap'}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{r.beschreibung}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Buchungs-Wizard */}
      {wizard?.schritte && (
        <div className="mb-6" data-pres="wizard">
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Der Buchungs-Wizard in fünf Schritten</h3>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            Kernstück des Prototyps – entspricht dem Sequenzdiagramm „Online-Buchung": Sitz-Hold (RESERVIERT), Zahlung, dann BELEGT + QR-Ticket.
          </p>
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            {wizard.schritte.map((s, idx) => (
              <div key={s.nr} className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: idx < wizard.schritte!.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white" style={{ background: ACCENT }}>
                  {s.nr}
                </div>
                <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                <span className="hidden sm:flex gap-1 flex-shrink-0">
                  {s.stories.map((st) => (
                    <span key={st} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-whiteboard)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>{st}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technik */}
      <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Technik</h3>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {techChips.map((t) => (
          <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            {t}
          </span>
        ))}
      </div>

      {/* Module status & roadmap (erweitert) */}
      {mode === 'erweitert' && (
        <div className="mt-7" data-pres="status">
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Module: implementiert vs. Roadmap</h3>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            Der Prototyp setzt {prototype.stats.rollenImplementiert}/{prototype.stats.rollenGesamt} Rollen und {prototype.stats.umlImplementiert} UML-Klassen um – {prototype.stats.umlDesignOnly} sind als Roadmap modelliert (Modell ⊇ Prototyp).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {prototype.module.map((m) => (
              <div key={m.id} className="flex items-start gap-2.5 rounded-xl p-3" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                <span className="mt-0.5 text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{ background: m.status === 'implementiert' ? '#437a2220' : '#d1990020', color: m.status === 'implementiert' ? '#437a22' : '#d19900' }}>
                  {m.status === 'implementiert' ? 'live' : 'Roadmap'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.beschreibung}</p>
                </div>
              </div>
            ))}
          </div>

          <h4 className="text-sm font-bold mt-5 mb-1" style={{ color: 'var(--text-primary)' }}>Roadmap: modelliert, noch nicht gebaut</h4>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            Diese Module sind vollständig im UML und in Stories modelliert (implementedInPrototype: false) und warten auf den Ausbau.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {prototype.roadmap.map((r) => (
              <div key={r.modul} className="flex items-start gap-2.5 rounded-xl p-3" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                <span className="mt-0.5 text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: '#d1990020', color: '#d19900' }}>
                  Roadmap
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{r.modul}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {r.persona} · {r.stories.join(', ')} · {r.umlClasses.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionShell>
  )
}

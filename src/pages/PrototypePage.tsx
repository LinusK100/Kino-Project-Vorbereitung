import {
  Smartphone, ExternalLink, Rocket, User, CreditCard, LineChart, ScanLine,
  Coffee, Wrench, Building2, ShieldCheck, Users, Boxes, ListChecks, GitBranch,
} from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { prototype, stories, uml } from '@/data/content'
import { zahlwort } from '@/lib/utils'

const ACCENT = '#964219'
// The full interactive Hi-Fi prototype is a separate app; this section is the
// only place that opens an external tab (per project requirement).
const PROTOTYPE_URL = import.meta.env.BASE_URL + 'prototyp-app/'

const roleIcon: Record<string, React.ElementType> = {
  endkunde: User, kasse: CreditCard, manager: LineChart, einlass: ScanLine,
  service: Coffee, facility: Wrench, marke: Building2, admin: ShieldCheck,
}

// Kein Einfach/Erweitert und keine Kino-Tour in diesem Abschnitt:
// Die Präsentation IST der Prototyp — die Seite führt direkt zu ihm hin
// und zeigt immer den vollen Stand (implementiert + Roadmap).

// Alle Kennzahlen aus den Listen berechnet (Rollen, Module, uml.json) —
// nicht aus einem separaten stats-Block, der divergieren könnte.
const rollenLive = prototype.rollen.filter((r) => r.status === 'implementiert').length
const rollenGesamt = prototype.rollen.length
const umlImpl = uml.classes.filter((c) => c.implementedInPrototype).length
const umlDesignOnly = uml.classes.length - umlImpl
const storiesAbgedeckt = new Set(
  prototype.module.filter((m) => m.status === 'implementiert').flatMap((m) => m.stories),
).size

export default function PrototypePage() {
  const wizard = prototype.module.find((m) => m.id === 'buchungs-wizard')
  const { tech } = prototype

  const kpis = [
    { icon: Users, value: `${rollenLive} / ${rollenGesamt}`, label: 'Rollen implementiert' },
    { icon: Boxes, value: umlImpl, label: 'UML-Klassen implementiert' },
    { icon: GitBranch, value: umlDesignOnly, label: 'UML-Klassen Design-only' },
    { icon: ListChecks, value: `${storiesAbgedeckt} / ${stories.erweitert.length}`, label: 'Stories abgedeckt' },
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
      modes={false}
      intro={
        <div className="flex flex-col sm:flex-row sm:items-center gap-4" data-pres="launch">
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold text-base flex-shrink-0 transition-transform hover:-translate-y-0.5"
            style={{ background: ACCENT, boxShadow: `0 6px 24px ${ACCENT}66` }}
          >
            <Rocket size={22} /> Prototyp starten <ExternalLink size={17} />
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
      <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Alle {zahlwort(rollenGesamt)} Rollen</h3>
      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
        {zahlwort(rollenLive, true)} Rollen sind vollständig klickbar – in der App oben umschaltbar.{' '}
        {zahlwort(rollenGesamt - rollenLive, true)} weitere sind modelliert und als Roadmap ausgewiesen.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6" data-pres="rollen">
        {prototype.rollen.map((r) => {
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
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Der Buchungs-Wizard in {zahlwort(wizard.schritte.length)} Schritten</h3>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            Von der Sitzwahl bis zum QR-Ticket – Vorstellung und Datum wählt man davor auf der Film-Detailseite.
            Der modellierte 10-Minuten-Hold (U47) ist bewusst Design-only: Im Prototyp sind belegte Plätze schlicht nicht wählbar.
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

      {/* Module status & roadmap */}
      <div className="mt-7" data-pres="status">
        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Module: implementiert vs. Roadmap</h3>
        <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          Der Prototyp setzt {rollenLive}/{rollenGesamt} Rollen, {umlImpl} UML-Klassen und {storiesAbgedeckt} von {stories.erweitert.length} Stories
          um – der Rest ist als Roadmap modelliert (Modell ⊇ Prototyp).
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
          Diese Module sind vollständig im UML und in Stories modelliert (implementedInPrototype: false) —
          damit ist jede Release-1-Story entweder klickbar umgesetzt oder hier verortet.
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
    </SectionShell>
  )
}

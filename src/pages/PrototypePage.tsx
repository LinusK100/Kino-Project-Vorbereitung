import { Smartphone, ExternalLink, Rocket, User, CreditCard, LineChart, ScanLine } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { prototype, uml } from '@/data/content'

const ACCENT = '#964219'
// Der volle interaktive Prototyp ist eine eigene App; nur dieser Abschnitt
// öffnet einen neuen Tab (Projekt-Vorgabe).
const PROTOTYPE_URL = import.meta.env.BASE_URL + 'prototyp-app/'

const roleIcon: Record<string, React.ElementType> = {
  endkunde: User, kasse: CreditCard, manager: LineChart, einlass: ScanLine,
}

// Kennzahlen aus den Listen berechnet, nicht hartkodiert.
const rollenLive = prototype.rollen.filter((r) => r.status === 'implementiert').length
const rollenGesamt = prototype.rollen.length
const umlImpl = uml.classes.filter((c) => c.implementedInPrototype).length
const liveRollen = prototype.rollen.filter((r) => r.status === 'implementiert')

export default function PrototypePage() {
  return (
    <SectionShell
      kicker="Ergebnis"
      title="Prototyp"
      subtitle="Die echte App · startet in einem neuen Tab"
      icon={Smartphone}
      accent={ACCENT}
      modes={false}
    >
      {/* Eigenständiger Hero: der Start steht im Vordergrund. */}
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden mb-5"
        style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #b8551f 55%, #c2410c 100%)` }}
      >
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Nicht nur beschrieben — gebaut
          </p>
          <h2 className="text-2xl md:text-[30px] font-bold text-white leading-tight mb-2.5" style={{ fontFamily: 'var(--font-display)' }}>
            Der Prototyp läuft im Browser
          </h2>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Ein klickbarer Hi-Fi-Prototyp mit Mock-API: buchen, an der Kasse verkaufen, das Kino
            steuern, am Einlass scannen — in vier umschaltbaren Rollen.
          </p>
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-base transition-transform hover:-translate-y-0.5"
            style={{ background: '#fff', color: ACCENT, boxShadow: '0 8px 28px rgba(0,0,0,0.28)' }}
          >
            <Rocket size={20} /> Prototyp starten <ExternalLink size={16} />
          </a>
        </div>
        <Rocket size={150} color="white" className="absolute -right-5 -bottom-8 opacity-10 hidden md:block" />
      </div>

      {/* Was klickbar ist: die vier Live-Rollen. */}
      <h3 className="text-sm font-bold mb-2.5" style={{ color: 'var(--text-primary)' }}>Was du ausprobieren kannst</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {liveRollen.map((r) => {
          const Icon = roleIcon[r.id] ?? User
          return (
            <div key={r.id} className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}15`, color: ACCENT }}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.label}</span>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{r.beschreibung}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Kurz eingeordnet: Modell ⊇ Prototyp, Roadmap nur benannt. */}
      <div className="rounded-xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          <strong>Modell ⊇ Prototyp:</strong> {rollenLive} von {rollenGesamt} Rollen und {umlImpl} von {uml.classes.length} UML-Klassen
          sind gebaut. Der Rest ist bewusst als Roadmap modelliert, nicht vergessen.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {prototype.rollen.filter((r) => r.status !== 'implementiert').map((r) => (
            <span key={r.id} className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#d1990018', color: '#a06a00', border: '1px solid #d1990040' }}>
              {r.label} · Roadmap
            </span>
          ))}
        </div>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-secondary)' }}>
          {prototype.tech.framework} · {prototype.tech.build} · {prototype.tech.api} · {prototype.tech.accessibility}
        </p>
      </div>
    </SectionShell>
  )
}

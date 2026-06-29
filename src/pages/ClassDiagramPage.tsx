import { useMemo, useState } from 'react'
import { Boxes, CheckCircle2, Circle } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { DiagramFrame } from '@/components/diagram/DiagramFrame'
import { ClassDiagram } from '@/components/diagram/ClassDiagram'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { uml } from '@/data/content'
import { useAppStore } from '@/store/appStore'
import { UML_GROUP_COLOR } from '@/lib/statusColors'
import type { UmlClass, PresentationStep } from '@/types'

const ACCENT = '#7a39bb'

const CORE = ['Kette', 'Kino', 'Kinosaal', 'Sitzplatz', 'Tarif', 'Film', 'Vorstellung', 'VorstellungSitz', 'Buchung', 'Ticket', 'Zahlung', 'Nutzer', 'Kunde', 'Sitzstatus', 'Ticketstatus', 'Buchungsstatus', 'Zahlungsstatus']

const groupLabel: Record<string, string> = { domain: 'Domäne', service: 'Services', store: 'Stores', dto: 'DTOs', enum: 'Enums' }

const steps: PresentationStep[] = [
  { id: 'intro', title: 'Klassendiagramm', body: 'Das Klassendiagramm zeigt die Struktur des Systems: Klassen mit Attributen und Operationen sowie ihre Beziehungen. Es modelliert das ganze Produkt – der Prototyp setzt eine Teilmenge um.', target: '[data-pres="section-header"]' },
  { id: 'kern', title: 'Der fachliche Kern', body: 'Die Kern-Ansicht zeigt das Rückgrat: vom Kino über Saal & Sitzplatz bis zu Vorstellung, Buchung, Ticket und Zahlung – ohne Überfrachtung.', target: '[data-pres="diagram"]', mode: 'einfach' },
  { id: 'assoc', title: 'VorstellungSitz – Assoziationsklasse', body: 'VorstellungSitz trägt die Operationen reservieren/belegen/freigeben am Objekt selbst (nicht beim Nutzer) und verhindert so Doppelbuchungen.', target: '[data-pres="diagram"]', mode: 'einfach' },
  { id: 'ops', title: 'Operationen am richtigen Ort', body: 'Status-ändernde Operationen stehen an den Domänenobjekten (Buchung.bestätigen(), Ticket.einlösen()), Enums sind separate Aufzählungen. Akteure rufen nur auf.', target: '[data-pres="ops-callout"]' },
  { id: 'all', title: 'Erweitert: alle 82 Klassen', body: 'Im Erweitert-Modus lassen sich alle 82 Klassen in 5 Gruppen erkunden – Domäne, Services, Stores, DTOs und Enums. Über die Ansicht filterst du je Gruppe.', target: '[data-pres="view-select"]', mode: 'erweitert' },
]

export default function ClassDiagramPage() {
  const { mode } = useAppStore()
  const [view, setView] = useState<string>('kern')
  const [selected, setSelected] = useState<string | null>(null)

  const views = mode === 'einfach'
    ? [{ id: 'kern', label: 'Kern' }, { id: 'enum', label: 'Enums' }]
    : [{ id: 'kern', label: 'Kern' }, { id: 'domain', label: 'Domäne' }, { id: 'service', label: 'Services' }, { id: 'store', label: 'Stores' }, { id: 'dto', label: 'DTOs' }, { id: 'enum', label: 'Enums' }, { id: 'alle', label: 'Alle 82' }]

  const visible = useMemo<UmlClass[]>(() => {
    if (view === 'kern') return uml.classes.filter((c) => CORE.includes(c.id))
    if (view === 'alle') return uml.classes
    return uml.classes.filter((c) => c.group === view)
  }, [view])

  const selectedClass = selected ? uml.classes.find((c) => c.id === selected) ?? null : null
  const implemented = uml.classes.filter((c) => c.implementedInPrototype).length

  return (
    <SectionShell
      kicker="Modellierung"
      title="Klassendiagramm"
      subtitle={`${uml.classes.length} Klassen · ${implemented} implementiert / ${uml.classes.length - implemented} Design-only`}
      icon={Boxes}
      accent={ACCENT}
      presentation={steps}
      intro={
        <div data-pres="ops-callout">
          <Callout kind="info" title="Notation">
            Name · Attribute · Operationen. <strong>◆</strong> Komposition · <strong>▷</strong> Vererbung · <strong>→</strong> Assoziation · <strong>⇢</strong> Abhängigkeit · grüner Punkt = implementiert.
            Status-Operationen stehen an den <strong>Objekten</strong> (<code>VorstellungSitz.reservieren()</code>), nicht bei den Akteuren; Enums sind separate Aufzählungen.
          </Callout>
        </div>
      }
    >
      {/* view selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4" data-pres="view-select">
        {views.map((v) => {
          const on = v.id === view
          return (
            <button key={v.id} onClick={() => { setView(v.id); setSelected(null) }}
              className="px-3 py-1.5 rounded-full text-sm font-semibold border transition-all"
              style={{ background: on ? ACCENT : 'var(--card-bg)', color: on ? '#fff' : 'var(--text-secondary)', borderColor: on ? ACCENT : 'var(--border-color)' }}>
              {v.label}
            </button>
          )
        })}
        <span className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>{visible.length} Klassen · Klick für Details</span>
      </div>

      <div data-pres="diagram">
        <DiagramFrame minHeight={420} legend={<ClassLegend />} fitOnLoad fitKey={`${view}-${selected ?? ''}`}>
          <ClassDiagram classes={visible} relationships={uml.relationships} selectedId={selected} onSelect={setSelected} />
        </DiagramFrame>
      </div>

      {/* Catalog (erweitert) */}
      {mode === 'erweitert' && (
        <div className="mt-6">
          <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Alle Klassen nach Gruppe</h3>
          {uml.groups.map((g) => {
            const cs = uml.classes.filter((c) => c.group === g.id)
            return (
              <div key={g.id} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded" style={{ background: UML_GROUP_COLOR[g.id] }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{g.label}</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cs.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cs.map((c) => (
                    <button key={c.id} onClick={() => setSelected(c.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors"
                      style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                      {c.implementedInPrototype ? <CheckCircle2 size={11} style={{ color: '#4ade80' }} /> : <Circle size={11} style={{ color: 'var(--text-secondary)' }} />}
                      {c.id}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ClassDrawer cls={selectedClass} onClose={() => setSelected(null)} />
    </SectionShell>
  )
}

function ClassLegend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
      {Object.entries(groupLabel).map(([g, l]) => (
        <span key={g} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: UML_GROUP_COLOR[g] }} />{l}</span>
      ))}
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: '#4ade80' }} /> implementiert</span>
      <span>◆ Komposition · ▷ Vererbung · → Assoziation · ⇢ Abhängigkeit</span>
    </div>
  )
}

function ClassDrawer({ cls, onClose }: { cls: UmlClass | null; onClose: () => void }) {
  const rels = useMemo(() => cls ? uml.relationships.filter((r) => r.from === cls.id || r.to === cls.id) : [], [cls])
  return (
    <Sheet open={!!cls} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        {cls && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: UML_GROUP_COLOR[cls.group] }}>{groupLabel[cls.group]}</span>
                {cls.stereotype && <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{cls.stereotype}</span>}
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: cls.implementedInPrototype ? '#437a2220' : 'var(--border-color)', color: cls.implementedInPrototype ? '#437a22' : 'var(--text-secondary)' }}>
                  {cls.implementedInPrototype ? 'implementiert' : 'Design-only'}
                </span>
              </div>
              <SheetTitle style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{cls.id}</SheetTitle>
            </SheetHeader>
            <div className="space-y-5 mt-5">
              {cls.attributes.length > 0 && (
                <Compartment title={cls.group === 'enum' ? 'Werte' : 'Attribute'}>
                  {cls.attributes.map((a, i) => (
                    <li key={i} className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                      {cls.group === 'enum' ? a.name : `${a.visibility} ${a.name}: ${a.type}`}
                    </li>
                  ))}
                </Compartment>
              )}
              {cls.methods.length > 0 && (
                <Compartment title="Operationen">
                  {cls.methods.map((m, i) => (
                    <li key={i} className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{m.visibility} {m.name}({m.params}): {m.returnType}</li>
                  ))}
                </Compartment>
              )}
              {rels.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Beziehungen</h4>
                  <ul className="space-y-1.5">
                    {rels.map((r) => (
                      <li key={r.id} className="text-xs" style={{ color: 'var(--text-primary)' }}>
                        <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{r.type}</span>{' '}
                        <strong>{r.from}</strong> → <strong>{r.to}</strong>{r.label ? ` (${r.label})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Compartment({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>{title}</h4>
      <ul className="space-y-1 p-3 rounded-lg" style={{ background: 'var(--bg-whiteboard)' }}>{children}</ul>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Target, Frown, Quote, Users, Crown, GitBranch } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { containerVariants, cardVariants } from '@/lib/transitions'
import { usePersonas, personaById } from '@/data/content'
import { useAppStore } from '@/store/appStore'
import type { Persona, PresentationStep } from '@/types'

const ACCENT = '#006494'

const steps: PresentationStep[] = [
  { id: 'intro', title: 'Was sind Personas?', body: 'Personas beschreiben die Nutzergruppen des Systems mit ihren Zielen und Frustrationen. Jede spätere User Story gehört zu genau einer Persona.', target: '[data-pres="section-header"]' },
  { id: 'einfach', title: 'Einfach: 4 Kern-Personas', body: 'Im Einfach-Modus siehst du die 4 MVP-Personas: die Dach-Persona „Endkunde" plus Kassiererin, Manager und Einlass. Genau die Rollen, die der Prototyp umsetzt.', target: '[data-pres="mode-toggle"]', mode: 'einfach' },
  { id: 'erweitert', title: 'Erweitert: 12 Personas', body: 'Im Erweitert-Modus differenziert sich „Endkunde" in Lara, Jonas, Hannelore und Sandra – plus Service, Facility, Marke und Admin. Eine echte Obermenge der Basis.', target: '[data-pres="group-filter"]', mode: 'erweitert' },
  { id: 'anatomy', title: 'Aufbau einer Persona', body: 'Jede Karte zeigt Ziele (was die Person erreichen will) und Frustrationen (was heute nervt). Aus genau diesem Spannungsfeld entstehen die User Stories.', target: '[data-pres="persona-first"]', mode: 'erweitert' },
  { id: 'umbrella', title: 'Dach-Persona & Ausprägungen', body: 'Die Dach-Persona „Endkunde" bündelt konkrete Kunden-Ausprägungen. So bleibt die Basis schlank, ohne im Erweitert-Modus an Differenzierung zu verlieren.', target: '[data-pres="persona-endkunde"]', mode: 'erweitert' },
]

export default function PersonasPage() {
  const personas = usePersonas()
  const { mode } = useAppStore()
  const [group, setGroup] = useState<string>('all')
  const [allOpen, setAllOpen] = useState(false)

  // reset group filter when the dataset (mode) changes — render-time pattern
  const [prevMode, setPrevMode] = useState(mode)
  if (mode !== prevMode) { setPrevMode(mode); setGroup('all') }

  const groups = Array.from(new Set(personas.map((p) => p.group)))
  const filtered = group === 'all' ? personas : personas.filter((p) => p.group === group)

  return (
    <SectionShell
      kicker="Anforderungen"
      title="Personas"
      subtitle={`${personas.length} Nutzerprofile · ${mode === 'einfach' ? 'Basis (MVP)' : 'Vollausbau'}`}
      icon={Users}
      accent={ACCENT}
      presentation={steps}
      intro={
        <Callout kind="info">
          Jede Persona steht für eine Nutzergruppe mit Zielen und Frustrationen.
          <strong> Einfach</strong> zeigt die 4 Kern-Personas (MVP), <strong>Erweitert</strong> alle 12.
          Jede User Story gehört zu genau einer Persona.
        </Callout>
      }
    >
      {/* Group filter */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap" data-pres="group-filter">
        <div className="flex gap-2 flex-wrap">
          <FilterChip label="Alle" active={group === 'all'} onClick={() => setGroup('all')} accent={ACCENT} />
          {groups.map((g) => (
            <FilterChip key={g} label={g} active={group === g} onClick={() => setGroup(g)} accent={ACCENT} />
          ))}
        </div>
        <button
          onClick={() => setAllOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
          style={{
            background: allOpen ? ACCENT : 'var(--card-bg)',
            color: allOpen ? 'white' : 'var(--text-secondary)',
            borderColor: allOpen ? ACCENT : 'var(--border-color)',
          }}
        >
          <ChevronDown size={13} style={{ transform: allOpen ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
          {allOpen ? 'Alle einklappen' : 'Alle ausklappen'}
        </button>
      </div>

      <motion.div
        key={`${mode}-${group}`}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {filtered.map((p, i) => (
          <PersonaCard
            key={`${p.id}-${allOpen}`}
            persona={p}
            forceOpen={allOpen}
            presAttr={i === 0 ? 'persona-first' : p.id === 'endkunde' ? 'persona-endkunde' : undefined}
          />
        ))}
      </motion.div>
    </SectionShell>
  )
}

function FilterChip({ label, active, onClick, accent }: { label: string; active: boolean; onClick: () => void; accent: string }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150"
      style={{
        background: active ? accent : 'var(--card-bg)',
        color: active ? 'white' : 'var(--text-secondary)',
        borderColor: active ? accent : 'var(--border-color)',
      }}
    >
      {label}
    </button>
  )
}

function PersonaCard({ persona, forceOpen, presAttr }: { persona: Persona; forceOpen: boolean; presAttr?: string }) {
  const [open, setOpen] = useState(forceOpen)
  const [prevForce, setPrevForce] = useState(forceOpen)
  if (forceOpen !== prevForce) { setPrevForce(forceOpen); setOpen(forceOpen) }

  const isUmbrella = !!persona.umbrella
  const refinesParent = persona.refines ? personaById[persona.refines] : null

  return (
    <motion.article
      variants={cardVariants}
      className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}
      data-pres={presAttr}
    >
      <div className="h-1 w-full" style={{ background: persona.color }} />
      <button className="w-full text-left px-5 py-4 flex items-center gap-4" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: persona.color, boxShadow: `0 2px 8px ${persona.color}50` }}
        >
          {persona.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{persona.name}</span>
            {isUmbrella && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1" style={{ background: `${persona.color}1a`, color: persona.color }}>
                <Crown size={10} /> Dach-Persona
              </span>
            )}
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold" style={{ background: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              {persona.roleEnum}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {persona.role} · {persona.age} Jahre · {persona.group}
            {refinesParent && <> · <span className="inline-flex items-center gap-0.5"><GitBranch size={10} /> aus {refinesParent.name.split(' ')[0]}</span></>}
          </p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <div className="px-5 pb-3 -mt-1">
        <blockquote className="text-xs italic pl-3 leading-relaxed" style={{ color: 'var(--text-secondary)', borderLeft: `2px solid ${persona.color}` }}>
          „{persona.motto}"
        </blockquote>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden' }}>
            <div className="mx-4 mb-4 rounded-xl overflow-hidden text-sm" style={{ border: '1px solid var(--border-color)' }}>
              <div className="px-4 py-3" style={{ background: `${persona.color}08` }}>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{persona.background}</p>
                {persona.refinedBy && persona.refinedBy.length > 0 && (
                  <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                    <strong style={{ color: persona.color }}>Ausprägungen:</strong>{' '}
                    {persona.refinedBy.map((id) => personaById[id]?.name.split(' ')[0] ?? id).join(', ')}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="px-4 py-3" style={{ borderRight: '1px solid var(--border-color)' }}>
                  <ListBlock icon={Target} color="#437a22" label="Ziele" items={persona.goals} />
                </div>
                <div className="px-4 py-3">
                  <ListBlock icon={Frown} color="#a13544" label="Frustrationen" items={persona.frustrations} />
                </div>
              </div>
              <div className="px-4 py-3 flex items-start gap-2" style={{ background: `${persona.color}10`, borderTop: '1px solid var(--border-color)' }}>
                <Quote size={14} className="flex-shrink-0 mt-0.5" style={{ color: persona.color }} />
                <p className="text-xs italic leading-relaxed" style={{ fontFamily: 'var(--font-display)', color: persona.color }}>{persona.motto}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function ListBlock({ icon: Icon, color, label, items }: { icon: React.ElementType; color: string; label: string; items: string[] }) {
  return (
    <>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={12} color={color} />
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
            {t}
          </li>
        ))}
      </ul>
    </>
  )
}

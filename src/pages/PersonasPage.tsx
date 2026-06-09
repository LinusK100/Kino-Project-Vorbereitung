import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Target, Frown, Quote, Users, Briefcase, UserCheck } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { pageVariants, containerVariants, cardVariants } from '@/lib/transitions'
import personasData from '@/data/personas.json'
import type { Persona } from '@/types'

const personas = personasData as Persona[]
const employeeIds = new Set(['monika', 'thomas', 'kevin'])

type Filter = 'all' | 'employee' | 'customer'

const filterConfig: { value: Filter; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'Alle Personas', icon: Users },
  { value: 'employee', label: 'Mitarbeiter', icon: Briefcase },
  { value: 'customer', label: 'Kunden', icon: UserCheck },
]

export default function PersonasPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [allOpen, setAllOpen] = useState(false)

  const filtered = personas.filter(p => {
    if (filter === 'employee') return employeeIds.has(p.id)
    if (filter === 'customer') return !employeeIds.has(p.id)
    return true
  })

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="Personas"
        description="6 Nutzerprofile des CineTicket-Systems"
        action={
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              background: allOpen ? '#01696f' : 'var(--card-bg)',
              color: allOpen ? 'white' : 'var(--text-secondary)',
              borderColor: allOpen ? '#01696f' : 'var(--border-color)',
            }}
            onClick={() => setAllOpen(o => !o)}
          >
            <ChevronDown
              size={13}
              style={{
                transform: allOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.25s',
              }}
            />
            {allOpen ? 'Alle einklappen' : 'Alle ausklappen'}
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filterConfig.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150"
            style={{
              background: filter === value ? '#01696f' : 'var(--card-bg)',
              color: filter === value ? 'white' : 'var(--text-secondary)',
              borderColor: filter === value ? '#01696f' : 'var(--border-color)',
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Grid — pass allOpen as key to force re-render when toggled globally */}
      <motion.div
        key={filter}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {filtered.map((persona) => (
          <PersonaCardWrapper key={`${persona.id}-${allOpen}`} persona={persona} forceOpen={allOpen} />
        ))}
      </motion.div>
    </motion.div>
  )
}

function PersonaCardWrapper({ persona, forceOpen }: { persona: Persona; forceOpen: boolean }) {
  const [open, setOpen] = useState(forceOpen)
  const isEmployee = employeeIds.has(persona.id)

  // Sync with global toggle
  const [prevForce, setPrevForce] = useState(forceOpen)
  if (forceOpen !== prevForce) {
    setPrevForce(forceOpen)
    setOpen(forceOpen)
  }

  return (
    <motion.article
      variants={cardVariants}
      className="rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-md"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      }}
    >
      <div className="h-1 w-full" style={{ background: persona.color }} />

      <button
        className="w-full text-left px-5 py-4 flex items-center gap-4"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: persona.color, boxShadow: `0 2px 8px ${persona.color}50` }}
        >
          {persona.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {persona.name}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: isEmployee ? 'rgba(1,105,111,0.1)' : 'rgba(122,57,187,0.1)',
                color: isEmployee ? '#01696f' : '#7a39bb',
              }}
            >
              {isEmployee ? 'Mitarbeiter' : 'Kunde'}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {persona.role} · {persona.age} Jahre
          </p>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* Motto preview */}
      <div className="px-5 pb-3 -mt-1">
        <blockquote
          className="text-xs italic pl-3 leading-relaxed"
          style={{ color: 'var(--text-secondary)', borderLeft: `2px solid ${persona.color}` }}
        >
          „{persona.motto}"
        </blockquote>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="mx-4 mb-4 rounded-xl overflow-hidden text-sm"
              style={{ border: '1px solid var(--border-color)' }}
            >
              {/* Background */}
              <div className="px-4 py-3" style={{ background: `${persona.color}08` }}>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {persona.background}
                </p>
              </div>

              <div className="grid grid-cols-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="px-4 py-3" style={{ borderRight: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Target size={12} color="#437a22" />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#437a22' }}>
                      Ziele
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {persona.goals.map((g, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#437a22' }} />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Frown size={12} color="#ef4444" />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#ef4444' }}>
                      Frustrationen
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {persona.frustrations.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#ef4444' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className="px-4 py-3 flex items-start gap-2"
                style={{ background: `${persona.color}10`, borderTop: '1px solid var(--border-color)' }}
              >
                <Quote size={14} className="flex-shrink-0 mt-0.5" style={{ color: persona.color }} />
                <p className="text-xs italic leading-relaxed" style={{ fontFamily: 'var(--font-display)', color: persona.color }}>
                  {persona.motto}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

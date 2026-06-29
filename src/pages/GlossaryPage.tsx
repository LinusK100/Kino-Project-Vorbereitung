import { useMemo, useState } from 'react'
import { BookMarked, Search, ArrowLeftRight } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { glossary } from '@/data/content'
import { useAppStore } from '@/store/appStore'
import type { PresentationStep } from '@/types'

const ACCENT = '#437a22'

const steps: PresentationStep[] = [
  { id: 'intro', title: 'Glossar', body: 'Das Glossar sorgt dafür, dass jeder Begriff in jedem Abschnitt dasselbe bedeutet – die Grundlage für Konsistenz über Personas, Stories, UML und Prototyp.', target: '[data-pres="section-header"]' },
  { id: 'search', title: 'Schnell nachschlagen', body: 'Über die Suche findest du jeden Begriff sofort – inklusive der wichtigen Abgrenzungen.', target: '[data-pres="search"]' },
  { id: 'pairs', title: 'Häufig verwechselte Paare', body: 'Im Erweitert-Modus erscheinen die kniffligen Paare wie Sitzkategorie vs. Ticketkategorie oder Sitzplatz vs. VorstellungSitz – mit klarer Abgrenzung.', target: '[data-pres="cats"]', mode: 'erweitert' },
  { id: 'roles', title: 'Rollen & Personas', body: 'Die Rollentabelle zeigt, welche Persona welche technische Rolle hat – KUNDE, KASSE, MANAGER und mehr.', target: '[data-pres="roles"]' },
]

export default function GlossaryPage() {
  const { mode } = useAppStore()
  const [q, setQ] = useState('')
  const cats = mode === 'einfach' ? glossary.categories.filter((c) => c.tier === 'basis') : glossary.categories

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return cats
    return cats.map((c) => ({ ...c, terms: c.terms.filter((t) => (t.term + t.definition + t.delimitation).toLowerCase().includes(needle)) })).filter((c) => c.terms.length > 0)
  }, [cats, q])

  return (
    <SectionShell
      kicker="Synthese"
      title="Glossar"
      subtitle={glossary.subtitle}
      icon={BookMarked}
      accent={ACCENT}
      presentation={steps}
      intro={<Callout kind="info" title="Eine Sprache">Einheitliche Begriffe über alle Artefakte – damit z. B. „Sitzstatus" und „Sitzkategorie" nie verwechselt werden.</Callout>}
    >
      <div className="relative mb-5 max-w-md" data-pres="search">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Begriff suchen …"
          className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        />
      </div>

      <div className="space-y-6" data-pres="cats">
        {filtered.map((cat) => (
          <div key={cat.id}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: ACCENT }}>{cat.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.terms.map((t) => (
                <div key={t.term} className="rounded-xl p-3.5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{t.term}</p>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{t.definition}</p>
                  <p className="text-xs leading-relaxed flex items-start gap-1.5" style={{ color: ACCENT }}>
                    <ArrowLeftRight size={12} className="flex-shrink-0 mt-0.5" />{t.delimitation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Kein Begriff gefunden.</p>}
      </div>

      {/* Roles */}
      <div className="mt-7" data-pres="roles">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: ACCENT }}>Rollen & Personas</h3>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-whiteboard)' }}>
                <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Rolle</th>
                <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Personas</th>
                <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Bereich</th>
              </tr>
            </thead>
            <tbody>
              {glossary.roles.map((r) => (
                <tr key={r.role} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td className="px-4 py-2 font-mono text-xs font-bold" style={{ color: ACCENT }}>{r.role}</td>
                  <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-primary)' }}>{r.personas}</td>
                  <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{r.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionShell>
  )
}

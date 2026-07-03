import { useMemo, useState } from 'react'
import { ListChecks, Download, ChevronRight, CheckCircle2 } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useStories, personaById } from '@/data/content'
import { useAppStore } from '@/store/appStore'
import { StoryKarte, StorySchema, StoryVerteilung } from '@/components/presentation/visuals/people'
import type { UserStory, Priority, PresentationStep, Mode } from '@/types'

const ACCENT = '#006494'
const priorities: Priority[] = ['high', 'medium', 'low']
const priorityLabel: Record<Priority, string> = { high: 'Hoch', medium: 'Mittel', low: 'Niedrig' }
const priorityLong: Record<Priority, string> = { high: 'Hohe Priorität', medium: 'Mittlere Priorität', low: 'Niedrige Priorität' }
const priorityColor: Record<Priority, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }
const releaseLabel: Record<number, string> = { 1: 'R1 – MVP', 2: 'R2 – Erweiterung', 3: 'R3 – Vollausbau' }
const releaseColor: Record<number, string> = { 1: '#437a22', 2: '#d19900', 3: '#a13544' }

// Einfach: die 30 MVP-Stories mit einem gut lesbaren Beispiel (U01).
// Erweitert: alle 51 — mit U47, dem fachlichen Kern (Sitz-Hold).
function stepsFor(mode: Mode): PresentationStep[] {
  return [
    {
      id: 'intro', title: 'Ein Satz, drei Antworten', visual: <StorySchema />,
      body: 'Jede User Story beschreibt eine Anforderung aus Nutzersicht – in einem Satz, der Persona, Ziel und Nutzen festhält. Dazu kommen testbare Akzeptanzkriterien als Definition von „fertig".',
    },
    mode === 'einfach'
      ? {
          id: 'zahlen', title: '30 Stories für den MVP', visual: <StoryVerteilung tier="basis" />,
          body: 'Jede Story trägt Release und MoSCoW-Priorität – zusammen ergibt das den Bauplan: Was kommt zuerst, was kann warten?',
        }
      : {
          id: 'zahlen', title: '30 im MVP, 51 im Vollausbau', visual: <StoryVerteilung tier="erweitert" />,
          body: 'Der Vollausbau erweitert die Basis, ohne sie zu ändern: Jede Story trägt Release und MoSCoW-Priorität – zusammen ergibt das den Bauplan.',
        },
    mode === 'einfach'
      ? {
          id: 'beispiel', title: 'So liest sich eine Story', visual: <StoryKarte id="U01" />,
          body: 'Monikas Schnellverkauf, komplett mit messbaren Akzeptanzkriterien: sichtbar, schnell, vorausgewählt. Genau so präzise ist jede der 30 Stories formuliert.',
        }
      : {
          id: 'kern', title: 'Der fachliche Kern: U47', visual: <StoryKarte id="U47" />,
          body: 'Der Sitz-Hold ist die wichtigste Regel des Systems: keine Doppelbuchung. Genau diese Story taucht im Sequenzdiagramm und im Zustandsautomaten wieder auf.',
        },
    { id: 'arbeit', title: 'Arbeiten mit den Stories', body: 'Die Tabelle lässt sich nach Persona, Priorität, Release und Aktivität filtern; ein Klick auf eine Zeile öffnet die Story mit ihren Akzeptanzkriterien – Export als CSV inklusive.' },
  ]
}

export default function UserStoriesPage() {
  const stories = useStories()
  const { mode } = useAppStore()
  const steps = useMemo(() => stepsFor(mode), [mode])
  const [selected, setSelected] = useState<UserStory | null>(null)
  const [persona, setPersona] = useState('all')
  const [priority, setPriority] = useState('all')
  const [release, setRelease] = useState('all')
  const [activity, setActivity] = useState('all')

  const [prevMode, setPrevMode] = useState(mode)
  if (mode !== prevMode) { setPrevMode(mode); setPersona('all'); setPriority('all'); setRelease('all'); setActivity('all') }

  const activities = useMemo(() => [...new Set(stories.map((s) => s.activity))], [stories])
  const personaIds = useMemo(() => [...new Set(stories.map((s) => s.persona))], [stories])

  const filtered = useMemo(() => stories.filter((s) => {
    if (persona !== 'all' && s.persona !== persona) return false
    if (priority !== 'all' && s.priority !== priority) return false
    if (release !== 'all' && s.release !== Number(release)) return false
    if (activity !== 'all' && s.activity !== activity) return false
    return true
  }), [stories, persona, priority, release, activity])

  const byRelease = [1, 2, 3].map((r) => stories.filter((s) => s.release === r).length)
  const byPriority = priorities.map((p) => stories.filter((s) => s.priority === p).length)
  const hasFilter = persona !== 'all' || priority !== 'all' || release !== 'all' || activity !== 'all'

  const exportCsv = () => {
    const headers = ['ID', 'Persona', 'Aktivität', 'Titel', 'Priorität', 'Release', 'Story']
    const rows = filtered.map((s) => [
      s.id, personaById[s.persona]?.name ?? s.persona, s.activity, s.title,
      priorityLabel[s.priority], `Release ${s.release}`, `"${s.story.replace(/"/g, '""')}"`,
    ])
    const csv = [headers, ...rows].map((r) => r.join(';')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'user-stories.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <SectionShell
      kicker="Anforderungen"
      title="User Stories"
      subtitle={`${stories.length} Stories · ${mode === 'einfach' ? 'Basis (U01–U30)' : 'Vollausbau (U01–U51)'} · gefiltert: ${filtered.length}`}
      icon={ListChecks}
      accent={ACCENT}
      presentation={steps}
      intro={
        <Callout kind="info" title="Schema">
          „Als <em>Persona</em> möchte ich <em>Ziel</em>, um <em>Nutzen</em>." Jede Story trägt Persona,
          Aktivität, Priorität (MoSCoW) und Release – und testbare Akzeptanzkriterien.
        </Callout>
      }
    >
      {/* Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4" data-pres="stats">
        <DistroBar label="Nach Release" segments={[1, 2, 3].map((r, i) => ({ label: releaseLabel[r], value: byRelease[i], color: releaseColor[r] }))} total={stories.length} />
        <DistroBar label="Nach Priorität (MoSCoW)" segments={priorities.map((p, i) => ({ label: priorityLabel[p], value: byPriority[i], color: priorityColor[p] }))} total={stories.length} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4" data-pres="filters">
        <FilterSelect value={persona} onChange={setPersona} label="Persona" width="w-44"
          options={[{ v: 'all', l: 'Alle Personas' }, ...personaIds.map((id) => ({ v: id, l: personaById[id]?.name ?? id }))]} />
        <FilterSelect value={priority} onChange={setPriority} label="Priorität" width="w-36"
          options={[{ v: 'all', l: 'Alle Prioritäten' }, ...priorities.map((p) => ({ v: p, l: priorityLabel[p] }))]} />
        <FilterSelect value={release} onChange={setRelease} label="Release" width="w-44"
          options={[{ v: 'all', l: 'Alle Releases' }, { v: '1', l: 'Release 1' }, { v: '2', l: 'Release 2' }, { v: '3', l: 'Release 3' }]} />
        <FilterSelect value={activity} onChange={setActivity} label="Aktivität" width="w-52"
          options={[{ v: 'all', l: 'Alle Aktivitäten' }, ...activities.map((a) => ({ v: a, l: a }))]} />
        {hasFilter && (
          <Button variant="ghost" size="sm" className="text-xs" style={{ color: 'var(--text-secondary)' }}
            onClick={() => { setPersona('all'); setPriority('all'); setRelease('all'); setActivity('all') }}>
            Filter zurücksetzen
          </Button>
        )}
        <Button onClick={exportCsv} variant="outline" size="sm" className="gap-2 ml-auto">
          <Download size={15} /> CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-color)', background: 'var(--card-bg)' }} data-pres="table">
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: 'var(--border-color)' }}>
              <TableHead className="w-14 text-xs font-semibold">ID</TableHead>
              <TableHead className="text-xs font-semibold">Persona</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Aktivität</TableHead>
              <TableHead className="text-xs font-semibold">Titel</TableHead>
              <TableHead className="text-xs font-semibold">Prio</TableHead>
              <TableHead className="text-xs font-semibold hidden sm:table-cell">Rel.</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => {
              const p = personaById[s.persona]
              return (
                <TableRow key={s.id} className="cursor-pointer transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                  style={{ borderColor: 'var(--border-color)' }} onClick={() => setSelected(s)}>
                  <TableCell className="font-mono text-xs font-bold" style={{ color: ACCENT }}>{s.id}</TableCell>
                  <TableCell>
                    {p && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: p.color }}>{p.avatar}</div>
                        <span className="text-xs hidden lg:inline" style={{ color: 'var(--text-secondary)' }}>{p.name.split(' ')[0]}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{s.activity}</TableCell>
                  <TableCell className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.title}</TableCell>
                  <TableCell><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: priorityColor[s.priority] }} title={priorityLabel[s.priority]} /></TableCell>
                  <TableCell className="text-xs hidden sm:table-cell"><span className="font-semibold" style={{ color: releaseColor[s.release] }}>R{s.release}</span></TableCell>
                  <TableCell><ChevronRight size={14} style={{ color: 'var(--text-secondary)' }} /></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {filtered.length === 0 && <div className="py-12 text-center" style={{ color: 'var(--text-secondary)' }}>Keine Stories gefunden</div>}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-xl max-h-[82vh] overflow-y-auto rounded-2xl"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          {selected && (() => {
            const p = personaById[selected.persona]
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-sm font-bold" style={{ color: ACCENT }}>{selected.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${priorityColor[selected.priority]}20`, color: priorityColor[selected.priority] }}>{priorityLong[selected.priority]}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${releaseColor[selected.release]}20`, color: releaseColor[selected.release] }}>{releaseLabel[selected.release]}</span>
                  </div>
                  <DialogTitle style={{ color: 'var(--text-primary)' }}>{selected.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 mt-5">
                  <div className="p-4 rounded-xl text-sm italic leading-relaxed" style={{ background: `${ACCENT}0d`, borderLeft: `3px solid ${ACCENT}`, color: 'var(--text-primary)' }}>{selected.story}</div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Akzeptanzkriterien</h4>
                    <ul className="space-y-2">
                      {selected.acceptanceCriteria.map((c, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                          <CheckCircle2 size={16} style={{ color: '#437a22', flexShrink: 0, marginTop: 2 }} />{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Aktivität</h4>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{selected.activity}</p>
                  </div>
                  {p && (
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${p.color}10`, border: `1px solid ${p.color}30` }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: p.color }}>{p.avatar}</div>
                      <div><p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.role}</p></div>
                    </div>
                  )}
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </SectionShell>
  )
}

function DistroBar({ label, segments, total }: { label: string; segments: { label: string; value: number; color: string }[]; total: number }) {
  return (
    <div className="rounded-xl p-3.5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <div className="h-3 rounded-full overflow-hidden flex mb-2" style={{ background: 'var(--border-color)' }}>
        {segments.map((s) => <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} title={`${s.label}: ${s.value}`} />)}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.label} <strong style={{ color: 'var(--text-primary)' }}>{s.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterSelect({ value, onChange, label, options, width }: { value: string; onChange: (v: string) => void; label: string; options: { v: string; l: string }[]; width: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`${width} h-9 text-sm`} aria-label={`${label} filtern`}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

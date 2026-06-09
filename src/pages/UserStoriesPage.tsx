import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Download, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { BadgePriority } from '@/components/shared/BadgePriority'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { pageVariants } from '@/lib/transitions'
import storiesData from '@/data/userStories.json'
import personasData from '@/data/personas.json'
import type { UserStory, Persona, Priority } from '@/types'

const stories = storiesData as UserStory[]
const personas = personasData as Persona[]

const activities = [...new Set(stories.map(s => s.activity))]
const priorities: Priority[] = ['high', 'medium', 'low']

const priorityLabel: Record<Priority, string> = { high: 'Hoch', medium: 'Mittel', low: 'Niedrig' }

export default function UserStoriesPage() {
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null)
  const [personaFilter, setPersonaFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [releaseFilter, setReleaseFilter] = useState<string>('all')
  const [activityFilter, setActivityFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    return stories.filter(s => {
      if (personaFilter !== 'all' && s.persona !== personaFilter) return false
      if (priorityFilter !== 'all' && s.priority !== priorityFilter) return false
      if (releaseFilter !== 'all' && s.release !== Number(releaseFilter)) return false
      if (activityFilter !== 'all' && s.activity !== activityFilter) return false
      return true
    })
  }, [personaFilter, priorityFilter, releaseFilter, activityFilter])

  const getPersona = (id: string) => personas.find(p => p.id === id)

  const exportCsv = () => {
    const headers = ['ID', 'Persona', 'Aktivität', 'Titel', 'Priorität', 'Release', 'Story']
    const rows = filtered.map(s => [
      s.id,
      getPersona(s.persona)?.name ?? s.persona,
      s.activity,
      s.title,
      priorityLabel[s.priority],
      `Release ${s.release}`,
      `"${s.story.replace(/"/g, '""')}"`,
    ])
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user-stories.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="User Stories"
        description={`${stories.length} Stories · Gefiltert: ${filtered.length}`}
        action={
          <Button onClick={exportCsv} variant="outline" size="sm" className="gap-2">
            <Download size={15} />
            CSV Export
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Select value={personaFilter} onValueChange={setPersonaFilter}>
          <SelectTrigger className="w-40 h-9 text-sm" aria-label="Persona filtern">
            <SelectValue placeholder="Persona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Personas</SelectItem>
            {personas.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-36 h-9 text-sm" aria-label="Priorität filtern">
            <SelectValue placeholder="Priorität" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Prioritäten</SelectItem>
            {priorities.map(p => (
              <SelectItem key={p} value={p}>{priorityLabel[p]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={releaseFilter} onValueChange={setReleaseFilter}>
          <SelectTrigger className="w-36 h-9 text-sm" aria-label="Release filtern">
            <SelectValue placeholder="Release" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Releases</SelectItem>
            <SelectItem value="1">Release 1 – MVP</SelectItem>
            <SelectItem value="2">Release 2 – Erweiterung</SelectItem>
            <SelectItem value="3">Release 3 – Vollausbau</SelectItem>
          </SelectContent>
        </Select>

        <Select value={activityFilter} onValueChange={setActivityFilter}>
          <SelectTrigger className="w-48 h-9 text-sm" aria-label="Aktivität filtern">
            <SelectValue placeholder="Aktivität" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Aktivitäten</SelectItem>
            {activities.map(a => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(personaFilter !== 'all' || priorityFilter !== 'all' || releaseFilter !== 'all' || activityFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setPersonaFilter('all'); setPriorityFilter('all'); setReleaseFilter('all'); setActivityFilter('all') }}
            className="text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            Filter zurücksetzen
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-color)', background: 'var(--card-bg)' }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: 'var(--border-color)' }}>
              <TableHead className="w-16 text-xs font-semibold">ID</TableHead>
              <TableHead className="text-xs font-semibold">Persona</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Aktivität</TableHead>
              <TableHead className="text-xs font-semibold">Titel</TableHead>
              <TableHead className="text-xs font-semibold">Priorität</TableHead>
              <TableHead className="text-xs font-semibold hidden sm:table-cell">Release</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((story) => {
              const persona = getPersona(story.persona)
              return (
                <TableRow
                  key={story.id}
                  className="cursor-pointer hover:bg-opacity-50 transition-colors"
                  style={{ borderColor: 'var(--border-color)' }}
                  onClick={() => setSelectedStory(story)}
                >
                  <TableCell className="font-mono text-xs font-semibold" style={{ color: '#01696f' }}>{story.id}</TableCell>
                  <TableCell>
                    {persona && (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: persona.color }}
                        >
                          {persona.avatar}
                        </div>
                        <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>{persona.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>
                    {story.activity}
                  </TableCell>
                  <TableCell className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{story.title}</TableCell>
                  <TableCell><BadgePriority priority={story.priority} /></TableCell>
                  <TableCell className="text-xs hidden sm:table-cell" style={{ color: 'var(--text-secondary)' }}>R{story.release}</TableCell>
                  <TableCell>
                    <ChevronRight size={14} style={{ color: 'var(--text-secondary)' }} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
            Keine Stories gefunden
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          {selectedStory && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold" style={{ color: '#01696f' }}>{selectedStory.id}</span>
                  <BadgePriority priority={selectedStory.priority} />
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    Release {selectedStory.release}
                  </span>
                </div>
                <SheetTitle style={{ color: 'var(--text-primary)' }}>{selectedStory.title}</SheetTitle>
              </SheetHeader>

              <div className="space-y-5 mt-5">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>User Story</h4>
                  <p className="text-sm p-3 rounded-lg italic" style={{ background: 'rgba(1,105,111,0.06)', color: 'var(--text-primary)', borderLeft: '3px solid #01696f' }}>
                    {selectedStory.story}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Aktivität</h4>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{selectedStory.activity}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Akzeptanzkriterien</h4>
                  <ul className="space-y-2">
                    {selectedStory.acceptanceCriteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                        <span
                          className="w-5 h-5 rounded flex items-center justify-center text-white text-xs flex-shrink-0 font-bold mt-0.5"
                          style={{ background: '#437a22' }}
                        >
                          {i + 1}
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {(() => {
                  const persona = getPersona(selectedStory.persona)
                  return persona ? (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Persona</h4>
                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: `${persona.color}10` }}>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ background: persona.color }}
                        >
                          {persona.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{persona.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{persona.role}</p>
                        </div>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}

import { useMemo, useState } from 'react'
import { Map, Ticket, ScanLine, Calendar, UserCircle, Settings, Search, LayoutGrid, CheckCircle2, Coffee, Wrench, Building2, CircleDot } from 'lucide-react'
import { SectionShell } from '@/components/shared/SectionShell'
import { Callout } from '@/components/shared/Callout'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useStoryMap, useStories, personaById } from '@/data/content'
import { useAppStore } from '@/store/appStore'
import { useDragScroll } from '@/lib/useDragScroll'
import { BackboneChips, ReleaseBaender } from '@/components/presentation/visuals/people'
import type { UserStory, ReleaseNumber, PresentationStep, Mode } from '@/types'

const ACCENT = '#006494'
const iconMap: Record<string, React.ElementType> = {
  ticket: Ticket, 'scan-line': ScanLine, calendar: Calendar, 'user-circle': UserCircle,
  settings: Settings, search: Search, 'layout-grid': LayoutGrid, coffee: Coffee,
  wrench: Wrench, 'building-2': Building2,
}
const activityColors = ['#01696f', '#006494', '#7a39bb', '#437a22', '#a13544', '#964219', '#2d6a8c', '#9333ea', '#c2410c', '#0e7490']
const rc: Record<number, { bg: string; bgDark: string; border: string; borderDark: string; text: string; textDark: string; label: string; dot: string }> = {
  1: { bg: '#e4f5ed', bgDark: '#1a3d28', border: '#437a22', borderDark: '#2d6b44', text: '#165c35', textDark: '#6ee7a8', label: 'Release 1 – MVP', dot: '#437a22' },
  2: { bg: '#fef7de', bgDark: '#3f2d00', border: '#d19900', borderDark: '#b07d00', text: '#7a5400', textDark: '#fbbf24', label: 'Release 2 – Erweiterung', dot: '#d19900' },
  3: { bg: '#fde8e1', bgDark: '#3f1210', border: '#a13544', borderDark: '#c0404f', text: '#9e2f14', textDark: '#f87171', label: 'Release 3 – Vollausbau', dot: '#a13544' },
}
const priorityDot: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }

// Backbone und Release-Bänder folgen dem Modus (7 vs. 10 Aktivitäten, 30 vs. 51 Stories).
function stepsFor(mode: Mode): PresentationStep[] {
  const tier = mode === 'einfach' ? 'basis' as const : 'erweitert' as const
  return [
    { id: 'intro', title: 'Zwei Dimensionen, ein Plan', body: 'Die Story Map ordnet alle User Stories zweidimensional: waagerecht die Nutzerreise (Aktivität → Schritt), senkrecht die zeitliche Auslieferung in Releases. So sieht man auf einen Blick, was zusammen den MVP ergibt.' },
    {
      id: 'backbone', title: 'Das Backbone: die Nutzerreise', visual: <BackboneChips tier={tier} />,
      body: mode === 'einfach'
        ? 'Sieben Aktivitäten bilden das Rückgrat – vom Ticketkauf über Sitzplan und Einlass bis zur Verwaltung. Jede Story hängt an genau einem Schritt dieser Reise.'
        : 'Die Aktivitäten bilden das Rückgrat – vom Ticketkauf über Sitzplan und Einlass bis zur Verwaltung. Der Erweitert-Modus ergänzt drei Aktivitäten, ohne die Struktur zu brechen.',
    },
    {
      id: 'releases', title: 'Waagerecht schneiden: Releases', visual: <ReleaseBaender tier={tier} />,
      body: 'Release 1 ist die schmale, lauffähige Scheibe quer durch alle Aktivitäten. Die weiteren Releases erweitern das System dort, wo es Wert stiftet – nicht einfach „mehr Features".',
    },
    { id: 'arbeit', title: 'Arbeiten mit der Karte', body: 'Auf der Website lässt sich jedes Release-Band hervorheben; jede Karte öffnet per Klick die Story mit Persona und Akzeptanzkriterien. Ziehen verschiebt die Karte waagerecht durch die ganze Reise.' },
  ]
}

export default function StoryMapPage() {
  const storyMap = useStoryMap()
  const stories = useStories()
  const { theme, mode } = useAppStore()
  const isDark = theme === 'dark'
  const steps = useMemo(() => stepsFor(mode), [mode])
  const [selected, setSelected] = useState<UserStory | null>(null)
  const [activeRelease, setActiveRelease] = useState<ReleaseNumber | null>(null)
  const { ref: mapRef, dragging, handlers } = useDragScroll<HTMLDivElement>()

  const storyById = (id: string) => stories.find((s) => s.id === id)
  const countByRelease = [1, 2, 3].map((r) => stories.filter((s) => s.release === r).length)

  const rowHeights = Object.fromEntries(([1, 2, 3] as ReleaseNumber[]).map((r) => {
    const maxCards = Math.max(...storyMap.activities.flatMap((a) => a.steps.map((s) =>
      s.stories.filter((id) => storyById(id)?.release === r).length)), 1)
    return [r, 16 + maxCards * 62 + Math.max(maxCards - 1, 0) * 6]
  })) as Record<ReleaseNumber, number>

  return (
    <SectionShell
      kicker="Anforderungen"
      title="Story Map"
      subtitle={`${storyMap.activities.length} Aktivitäten · ${stories.length} Stories · ${mode === 'einfach' ? 'Basis' : 'Vollausbau'}`}
      icon={Map}
      accent={ACCENT}
      presentation={steps}
      intro={
        <Callout kind="info" title="Lesart">
          <strong>Waagerecht</strong> = Nutzer-Workflow (Aktivität → Schritt), <strong>senkrecht</strong> = Release.
          So sieht man, welche Stories zusammen den MVP ergeben und was später folgt.
        </Callout>
      }
      legend={
        <div className="flex items-center gap-5 flex-wrap">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Priorität:</span>
          {Object.entries(priorityDot).map(([k, c]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />{k === 'high' ? 'Hoch' : k === 'medium' ? 'Mittel' : 'Niedrig'}
            </div>
          ))}
        </div>
      }
    >
      {/* Release filter */}
      <div className="flex flex-wrap gap-3 mb-4 items-center" data-pres="release-filter">
        {([1, 2, 3] as ReleaseNumber[]).map((r) => {
          const c = rc[r]; const on = activeRelease === r
          return (
            <button key={r} onClick={() => setActiveRelease(on ? null : r)} aria-pressed={on}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{ background: on ? c.dot : 'var(--card-bg)', color: on ? '#fff' : (isDark ? c.textDark : c.text), borderColor: on ? c.dot : c.border }}>
              <span className="w-2 h-2 rounded-full" style={{ background: on ? '#fff' : c.dot }} />
              {c.label}
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: on ? 'rgba(255,255,255,0.25)' : `${c.dot}20`, color: on ? '#fff' : c.dot }}>{countByRelease[r - 1]}</span>
            </button>
          )
        })}
        <span className="ml-auto text-xs px-3 py-1.5 rounded-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Ziehen verschiebt die Karte · Klick öffnet die Story</span>
      </div>

      <div
        ref={mapRef} {...handlers}
        className="overflow-x-auto pb-4 rounded-xl select-none"
        style={{ border: '1px solid var(--border-color)', cursor: dragging ? 'grabbing' : 'grab' }}
        data-pres="map"
      >
        <TooltipProvider>
          <div className="inline-flex min-w-max">
            {/* sticky release labels */}
            <div className="flex flex-col flex-shrink-0" style={{ position: 'sticky', left: 0, zIndex: 20, background: 'var(--card-bg)' }}>
              <div style={{ height: 48, background: isDark ? '#111' : '#f8f8f8' }} />
              <div style={{ height: 40, background: isDark ? '#111' : '#f8f8f8', borderBottom: '1px solid var(--border-color)' }} />
              {([1, 2, 3] as ReleaseNumber[]).map((r) => {
                const c = rc[r]
                return (
                  <div key={r} className="flex items-center justify-center px-2" style={{ height: rowHeights[r], background: isDark ? c.bgDark : c.bg, borderTop: `1px solid ${isDark ? c.borderDark : c.border}`, writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: isDark ? c.textDark : c.text, width: 36 }}>{c.label}</div>
                )
              })}
            </div>

            {storyMap.activities.map((activity, ai) => {
              const Icon = iconMap[activity.icon] ?? CircleDot
              const ac = activityColors[ai % activityColors.length]
              return (
                <div key={activity.id} className="flex flex-col">
                  <div className="flex items-center gap-2 px-4 font-bold text-xs text-white uppercase tracking-wider" style={{ background: ac, width: activity.steps.length * 190, minWidth: activity.steps.length * 190, height: 48, borderRight: '2px solid rgba(255,255,255,0.2)' }}>
                    <Icon size={14} /><span className="truncate">{activity.name}</span>
                  </div>
                  <div className="flex flex-1">
                    {activity.steps.map((step) => (
                      <div key={step.id} className="flex flex-col" style={{ width: 190 }}>
                        <div className="flex items-center px-3 font-semibold text-xs" style={{ height: 40, background: `${ac}22`, borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', color: ac }}>{step.name}</div>
                        {([1, 2, 3] as ReleaseNumber[]).map((r) => {
                          const c = rc[r]
                          const band = step.stories.map(storyById).filter((s): s is UserStory => !!s && s.release === r)
                          const dimmed = activeRelease !== null && activeRelease !== r
                          return (
                            <div key={r} className="p-2 flex flex-col gap-1.5" style={{ background: isDark ? c.bgDark : c.bg, borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', height: rowHeights[r], overflow: 'hidden', opacity: dimmed ? 0.3 : 1, transition: 'opacity 0.2s' }}>
                              {band.map((story) => {
                                const p = personaById[story.persona]
                                return (
                                  <Tooltip key={story.id}>
                                    <TooltipTrigger asChild>
                                      <button onClick={() => setSelected(story)} className="w-full text-left rounded-lg p-2 transition-all hover:-translate-y-0.5"
                                        style={{ background: isDark ? '#1e1e1e' : '#fff', border: `1px solid ${isDark ? c.borderDark : c.border}`, borderLeft: `3px solid ${isDark ? c.borderDark : c.border}`, boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-mono font-bold text-xs" style={{ color: ac }}>{story.id}</span>
                                          <div className="flex items-center gap-1">
                                            {p && <div className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: p.color, fontSize: 8 }}>{p.avatar[0]}</div>}
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: priorityDot[story.priority] }} />
                                          </div>
                                        </div>
                                        <p className="text-xs leading-snug" style={{ color: isDark ? '#e5e7eb' : '#1a1a1a' }}>{story.title}</p>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-72 text-xs"><p className="font-semibold mb-1">{story.title}</p><p className="leading-relaxed">{story.story}</p></TooltipContent>
                                  </Tooltip>
                                )
                              })}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </TooltipProvider>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-xl max-h-[82vh] overflow-y-auto rounded-2xl"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          {selected && (() => {
            const p = personaById[selected.persona]; const c = rc[selected.release]
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-sm font-bold" style={{ color: ACCENT }}>{selected.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: isDark ? c.bgDark : c.bg, color: isDark ? c.textDark : c.text, border: `1px solid ${isDark ? c.borderDark : c.border}` }}>{c.label}</span>
                  </div>
                  <DialogTitle style={{ color: 'var(--text-primary)' }}>{selected.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 mt-5">
                  <div className="p-4 rounded-xl text-sm italic leading-relaxed" style={{ background: `${ACCENT}0d`, borderLeft: `3px solid ${ACCENT}`, color: 'var(--text-primary)' }}>{selected.story}</div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Akzeptanzkriterien</h4>
                    <ul className="space-y-2">{selected.acceptanceCriteria.map((cr, i) => <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-primary)' }}><CheckCircle2 size={16} style={{ color: '#437a22', flexShrink: 0, marginTop: 2 }} />{cr}</li>)}</ul>
                  </div>
                  {p && <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${p.color}10`, border: `1px solid ${p.color}30` }}><div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: p.color }}>{p.avatar}</div><div><p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.role}</p></div></div>}
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </SectionShell>
  )
}
